"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
// Above-fold sections: loaded immediately (LCP-critical)
import { HomeHero } from "@/components/home/home-hero";
import { HomeLatest } from "@/components/home/home-latest";
import type { Post } from "@/lib/posts";
import dictionary from "@/dictionaries/en.json";

// Below-fold sections: code-split so their JS is not in the initial bundle
const HomeTransitionNote = dynamic(
  () =>
    import("@/components/home/home-transition-note").then((m) => ({
      default: m.HomeTransitionNote,
    })),
  { loading: () => <div className="min-h-[120px]" /> },
);

const HomeTutorials = dynamic(
  () =>
    import("@/components/home/home-tutorials").then((m) => ({
      default: m.HomeTutorials,
    })),
  { loading: () => <div className="min-h-[400px]" /> },
);

const HomeTopics = dynamic(
  () =>
    import("@/components/home/home-topics").then((m) => ({
      default: m.HomeTopics,
    })),
  { loading: () => <div className="min-h-[400px]" /> },
);

const HomeUpdates = dynamic(
  () =>
    import("@/components/home/home-updates").then((m) => ({
      default: m.HomeUpdates,
    })),
  { loading: () => <div className="min-h-[400px]" /> },
);

export function HomeClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const spreadsheetTags = new Set(["excel", "google-sheets", "spreadsheet", "formula", "template"]);

  const allPosts = useMemo(() => {
    return [...initialPosts].sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
  }, [initialPosts]);

  const seenSlugs = new Set<string>();

  // Take all featured posts — the hero supports any count
  const featuredPosts = allPosts
    .filter((post) =>
      post.frontmatter.published && post.frontmatter.featured
    )
    .slice(0, 6);
  featuredPosts.forEach((p) => seenSlugs.add(p.slug));

  const latestPosts = allPosts
    .filter(
      (post) => post.frontmatter.published && !seenSlugs.has(post.slug),
    )
    .slice(0, 6);
  latestPosts.forEach((p) => seenSlugs.add(p.slug));

  const manualTutorialPosts = allPosts.filter(
    (post) =>
      post.frontmatter.published &&
      post.frontmatter.tags?.some((tag: string) => tag.toLowerCase() === "tutorial") &&
      post.frontmatter.tags?.some((tag: string) => spreadsheetTags.has(tag.toLowerCase())),
  ).slice(0, 6);
  manualTutorialPosts.forEach((p) => seenSlugs.add(p.slug));

  const topicPosts = allPosts
    .filter(
      (post) =>
        post.frontmatter.published &&
        !seenSlugs.has(post.slug) &&
        post.frontmatter.tags?.some(
          (tag: string) => spreadsheetTags.has(tag.toLowerCase()),
        ),
    )
    .slice(0, 8);
  topicPosts.forEach((p) => seenSlugs.add(p.slug));

  const primaryUpdatePosts = allPosts
    .filter(
      (post) =>
        post.frontmatter.published &&
        !seenSlugs.has(post.slug) &&
        post.frontmatter.tags?.some((tag: string) => spreadsheetTags.has(tag.toLowerCase())) &&
        ((post.frontmatter.category || "").toLowerCase().includes("update") ||
          post.frontmatter.tags?.some((tag: string) => {
            const normalized = tag.toLowerCase();
            return normalized === "update" || normalized === "news";
          })),
    )
    .slice(0, 6);

  const updateFallback = allPosts.filter(
    (post) =>
      post.frontmatter.published &&
      !seenSlugs.has(post.slug) &&
      post.frontmatter.tags?.some((tag: string) => spreadsheetTags.has(tag.toLowerCase())),
  );

  const updatePosts = [
    ...primaryUpdatePosts,
    ...updateFallback.filter(
      (post) => !primaryUpdatePosts.some((picked) => picked.slug === post.slug),
    ),
  ].slice(0, 6);

  return (
    <div className="w-full">
      <HomeHero
        posts={featuredPosts}
        dictionary={dictionary}
      />

      <HomeLatest
        posts={latestPosts}
        dictionary={dictionary}
      />

      <HomeTransitionNote
        eyebrow="Editorial Note"
        title="Entering A More Focused Spreadsheet Flow"
        subtitle="A short context before continuing to the next sections"
        description="The next sections are arranged from practical to contextual: formula tutorials, template highlights, key spreadsheet updates, and concise technical notes."
        ctaText="Continue to Tutorials"
        ctaHref="/tags/tutorial"
      />

      {manualTutorialPosts.length > 0 && (
        <HomeTutorials
          posts={manualTutorialPosts}
          title="Spreadsheet Formula & Automation Guide"
          viewMoreText="view complete guide"
          dictionary={dictionary}
          tag="Spreadsheet Guide"
        />
      )}

      {topicPosts.length > 0 && (
        <HomeTopics
          posts={topicPosts}
          title="Excel & Google Sheets Highlights"
          viewAllText="View All Posts"
          dictionary={dictionary}
          tag="Excel"
          viewAllHref="/blog"
        />
      )}

      {updatePosts.length > 0 && (
        <HomeUpdates
          posts={updatePosts}
          title="Important Updates & News"
          viewMoreText="view all articles"
          dictionary={dictionary}
          viewMoreHref="/blog"
        />
      )}
    </div>
  );
}
