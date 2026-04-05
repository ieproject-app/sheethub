"use client";

import React, { useMemo } from "react";
import { HomeTutorials } from "@/components/home/home-tutorials";
import { HomeTopics } from "@/components/home/home-topics";
import { HomeUpdates } from "@/components/home/home-updates";
import { HomeNotes } from "@/components/home/home-notes";
import { HomeTransitionNote } from "@/components/home/home-transition-note";
import { HomeHero } from "@/components/home/home-hero";
import { HomeLatest } from "@/components/home/home-latest";
import type { Post, PostFrontmatter } from "@/lib/posts";
import type { Note, NoteFrontmatter } from "@/lib/notes";
import type { Dictionary } from "@/lib/get-dictionary";

export function HomeClient({
  initialPosts,
  initialNotes,
  dictionary,
  locale,
}: {
  initialPosts: Post<PostFrontmatter>[];
  initialNotes: Note<NoteFrontmatter>[];
  dictionary: Dictionary;
  locale: string;
}) {
  const linkPrefix = locale === "en" ? "" : `/${locale}`;
  const spreadsheetTags = new Set(["excel", "google-sheets", "spreadsheet", "formula", "template"]);

  const allPosts = useMemo(() => {
    return [...initialPosts].sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
  }, [initialPosts]);

  const latestNotes = useMemo(() => {
    return [...initialNotes]
      .sort(
        (a, b) =>
          new Date(b.frontmatter.date).getTime() -
          new Date(a.frontmatter.date).getTime(),
      )
      .slice(0, 6);
  }, [initialNotes]);

  // --- Deduplication: each section only shows articles not yet shown above ---
  const seenSlugs = new Set<string>();

  // --- Featured Posts: 2 Excel + 2 Google Sheets ---
  const excelTags = new Set(["excel", "microsoft-excel", "spreadsheet"]);
  const sheetsTags = new Set(["google-sheets", "sheets", "spreadsheet"]);
  
  const featuredExcelPosts = allPosts
    .filter((post) => 
      post.frontmatter.published && 
      post.frontmatter.featured &&
      post.frontmatter.tags?.some((tag: string) => excelTags.has(tag.toLowerCase()))
    )
    .slice(0, 2);
  
  const featuredSheetsPosts = allPosts
    .filter((post) => 
      post.frontmatter.published && 
      post.frontmatter.featured &&
      post.frontmatter.tags?.some((tag: string) => sheetsTags.has(tag.toLowerCase()))
    )
    .slice(0, 2);
  
  const featuredPosts = [...featuredExcelPosts, ...featuredSheetsPosts];
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

  const topicTag = "Excel";
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

  const updateTag = "Google Sheets";
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

  const focusTopicsTitle = locale === "id" ? "Sorotan Excel & Google Sheets" : "Excel & Google Sheets Highlights";
  const updatesTitle = locale === "id" ? "Update Penting Spreadsheet" : "Important Spreadsheet Updates";
  const updatesViewMore = locale === "id" ? "lihat update" : "view updates";
  const notesTitle = locale === "id" ? "Update Cepat Excel & Google Sheets" : "Quick Excel & Google Sheets Updates";
  const notesViewMore = locale === "id" ? "Selengkapnya" : "View Notes";
  const transitionEyebrow = locale === "id" ? "Catatan Redaksi" : "Editorial Note";
  const transitionTitle = locale === "id" ? "Masuk Ke Alur Spreadsheet Yang Lebih Fokus" : "Entering A More Focused Spreadsheet Flow";
  const transitionSubtitle = locale === "id"
    ? "Ringkasan singkat sebelum berlanjut ke section berikutnya"
    : "A short context before continuing to the next sections";
  const transitionDescription = locale === "id"
    ? "Bagian selanjutnya disusun dari praktik ke konteks: tutorial rumus, sorotan template, update penting fitur spreadsheet, lalu catatan teknis ringkas. Tujuannya agar urutan baca lebih natural dan langsung bisa dipraktikkan."
    : "The next sections are arranged from practical to contextual: formula tutorials, template highlights, key spreadsheet updates, and concise technical notes. This keeps the reading flow intentional and immediately actionable.";
  const tutorialTitle = locale === "id" ? "Panduan Formula & Otomasi Spreadsheet" : "Spreadsheet Formula & Automation Guide";
  const tutorialViewMore = locale === "id" ? "lihat panduan lengkap" : "view complete guide";
  const transitionCta = locale === "id" ? "Lanjut ke Tutorial" : "Continue to Tutorials";

  return (
    <div className="w-full">
      <HomeHero
        posts={featuredPosts}
        dictionary={dictionary}
        locale={locale}
        linkPrefix={linkPrefix}
      />

      <HomeLatest
        posts={latestPosts}
        dictionary={dictionary}
        locale={locale}
        linkPrefix={linkPrefix}
      />

      <HomeTransitionNote
        eyebrow={transitionEyebrow}
        title={transitionTitle}
        subtitle={transitionSubtitle}
        description={transitionDescription}
        ctaText={transitionCta}
        ctaHref={`${linkPrefix}/tags/tutorial`}
      />

      {manualTutorialPosts.length > 0 && (
        <HomeTutorials
          posts={manualTutorialPosts}
          title={tutorialTitle}
          viewMoreText={tutorialViewMore}
          dictionary={dictionary}
          locale={locale}
          tag="Spreadsheet Guide"
        />
      )}

      {topicPosts.length > 0 && (
        <HomeTopics
          posts={topicPosts}
          title={focusTopicsTitle}
          viewAllText={dictionary.home.viewAllPosts}
          dictionary={dictionary}
          locale={locale}
          linkPrefix={linkPrefix}
          tag={topicTag}
          viewAllHref={`${linkPrefix}/blog`}
        />
      )}

      {updatePosts.length > 0 && (
        <HomeUpdates
          posts={updatePosts}
          title={updatesTitle}
          viewMoreText={updatesViewMore}
          dictionary={dictionary}
          locale={locale}
          tag={updateTag}
          viewMoreHref={`${linkPrefix}/blog`}
        />
      )}

      {latestNotes.length > 0 && (
        <HomeNotes
          notes={latestNotes}
          title={notesTitle}
          viewMoreText={notesViewMore}
          dictionary={dictionary}
          locale={locale}
          linkPrefix={linkPrefix}
          viewMoreHref={`${linkPrefix}/notes`}
        />
      )}
    </div>
  );
}
