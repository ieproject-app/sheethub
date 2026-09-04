import {
  getPostData,
  getAllPostSlugs,
  getSortedPostsData,
} from "@/lib/posts";
import dictionary from "@/dictionaries/en.json";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { ArticleComments } from "@/components/blog/article-comments";
import { ArticleMeta } from "@/components/blog/article-meta";
import { ArticleShare } from "@/components/blog/article-share";
import { ArticleRelated } from "@/components/blog/article-related";
import { ArticleTOC } from "@/components/blog/article-toc";
import { ArticleTags } from "@/components/blog/article-tags";
import { ArticleTracker } from "@/components/blog/article-tracker";
import { AdSenseSlot } from "@/components/ads/adsense-slot";
import { extractHeadings } from "@/lib/mdx-utils";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import excelFormulaGrammar from "@/grammars/excel-formula.tmLanguage.json";

/** Safely convert a date string to ISO string; falls back to current date if invalid/missing. */
function safeToISO(dateStr: string | undefined | null): string {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

// Only known published slugs should resolve for article pages.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) return {};

  const canonicalPath = "/blog/" + slug;

  // A real hero image URL (e.g. Cloudinary) wins when present; the
  // "default-og" sentinel falls back to the generated per-article card
  // served by ./opengraph-image.tsx in this segment.
  const externalHero =
    post.frontmatter.heroImage && /^https?:\/\//.test(post.frontmatter.heroImage)
      ? post.frontmatter.heroImage
      : null;
  const ogImageUrl = externalHero ?? `/blog/${slug}/opengraph-image`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags?.length ? post.frontmatter.tags : undefined,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url: "https://sheethub.web.id" + canonicalPath,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.frontmatter.title,
        },
      ],
      publishedTime: safeToISO(post.frontmatter.date),
      modifiedTime: safeToISO(post.frontmatter.updated ?? post.frontmatter.date),
	      authors: ["SheetHub"],
      tags: post.frontmatter.tags?.length ? post.frontmatter.tags : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogImageUrl.startsWith("http") ? ogImageUrl : "https://sheethub.web.id" + ogImageUrl],
      creator: "@sheethub",
      site: "@sheethub",
    },
    other: {
      "article:author": "https://sheethub.web.id/about",
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((item) => ({ slug: item.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialPost = await getPostData(slug);

  if (!initialPost) {
    notFound();
  }

  const headings = extractHeadings(initialPost.content || "");
  const wordCount = (initialPost.content || "").trim().split(/\s+/).filter(Boolean).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));


  const breadcrumbSegments = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: initialPost.frontmatter.category || "Blog" },
  ];

  const allPosts = await getSortedPostsData();
  const currentTags = initialPost.frontmatter.tags ?? [];
  const currentCategory = initialPost.frontmatter.category;
  const initialRelatedContent = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => {
      if (currentCategory && p.frontmatter.category === currentCategory) return true;
      if (currentTags.length > 0 && p.frontmatter.tags?.some((t: string) => currentTags.includes(t))) return true;
      return false;
    })
    .slice(0, 12);

  const canonicalPath = "/blog/" + slug;

  return (
    <div className="w-full">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-24">
        {/* Main Article & Right TOC 2-Column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* Center Main Article */}
          <article className="xl:col-span-8 min-w-0">
            <ArticleTracker slug={initialPost.slug} />
            <header className="mb-8 text-left border-b border-border/60 pb-6">
              <LayoutBreadcrumbs
                segments={breadcrumbSegments}
                className="mb-4"
              />

              {initialPost.frontmatter.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-4">
                  <span>{initialPost.frontmatter.category}</span>
                  {readingTime ? (
                    <>
                      <span>•</span>
                      <span>{readingTime} min read</span>
                    </>
                  ) : null}
                </div>
              )}

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                {initialPost.frontmatter.title}
              </h1>

              {initialPost.frontmatter.description && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  {initialPost.frontmatter.description}
                </p>
              )}

              <ArticleMeta
                frontmatter={initialPost.frontmatter}
                readingTime={readingTime}
                isCentered={false}
              />
            </header>

            {/* In-Article Mobile TOC */}
            <ArticleTOC headings={headings} />

            {/* Core MDX Content — Completely Untouched Logic */}
            <div className="text-base sm:text-lg text-foreground/90 prose-content">
              <MDXRemote
                source={initialPost.content || ""}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [[rehypeShiki, {
                      theme: "github-dark",
                      langs: [excelFormulaGrammar],
                      langAlias: { excel: "excel-formula" },
                      fallbackLanguage: "text",
                    }]],
                  },
                }}
              />
            </div>

            <ArticleTags
              tags={initialPost.frontmatter.tags || []}
              linkPrefix=""
              title="Topics in this article"
              description="Explore related topics and continue reading similar content."
              className="mt-14 bg-muted/20"
            />

            {/* Sequential Learning Path & Deep Dives */}
            <ArticleRelated
              type="blog"
              currentSlug={initialPost.slug}
              currentTags={currentTags}
              currentCategory={currentCategory}
              initialRelatedContent={initialRelatedContent}
              dictionary={dictionary}
            />

            <div className="mt-14 flex flex-col gap-4 text-center border-t border-border/60 pt-10">
              <h3 className="text-sm font-mono font-bold tracking-tight text-foreground uppercase">
                Share this tutorial
              </h3>
              <ArticleShare
                title={initialPost.frontmatter.title}
              />
            </div>

            <ArticleComments
              article={{
                slug: initialPost.slug,
                title: initialPost.frontmatter.title,
              }}
              type="blog"
            />
          </article>

          {/* Right Rail: Sticky On-This-Page TOC + Reserved AdSense Slot (Desktop xl+) */}
          <aside className="hidden xl:block xl:col-span-4 sticky top-20 pl-2 space-y-8 min-w-[300px]">
            <ArticleTOC headings={headings} isDesktopRail={true} />

            {/* Reserved Right Rail Sticky AdSense Container (Localhost Dev Preview Only) */}
            <AdSenseSlot
              id="sheethub-right-rail-ad-slot"
              slotType="right-rail-sticky"
              label="Right Rail Ad Placement"
            />
          </aside>

        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": initialPost.frontmatter.title,
            "description": initialPost.frontmatter.description,
            "datePublished": safeToISO(initialPost.frontmatter.date),
            "dateModified": safeToISO(initialPost.frontmatter.updated || initialPost.frontmatter.date),
            "inLanguage": "en",
            "wordCount": wordCount,
            ...(currentTags.length > 0 ? { "keywords": currentTags } : {}),
	            "author": {
	              "@type": "Person",
	              "name": initialPost.frontmatter.author || "Iwan Efendi",
	              "url": "https://sheethub.web.id/about",
	            },
            "publisher": {
              "@type": "Organization",
              "name": "SheetHub",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sheethub.web.id/images/logo/logo.svg",
              },
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://sheethub.web.id" + canonicalPath,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbSegments.map((segment, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": segment.label,
              "item": segment.href
                ? "https://sheethub.web.id" + segment.href
                : undefined,
            })),
          }),
        }}
      />
      {(currentTags.some((t: string) => t.toLowerCase() === "tutorial") ||
        currentCategory?.toLowerCase() === "tutorial") &&
        headings.filter((h) => h.level === 2).length >= 2 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": initialPost.frontmatter.title,
              "description": initialPost.frontmatter.description,
              "totalTime": "PT" + readingTime + "M",
              "step": headings
                .filter((h) => h.level === 2)
                .map((h, i) => ({
                  "@type": "HowToStep",
                  "position": i + 1,
                  "name": h.text,
                  "url": "https://sheethub.web.id" + canonicalPath + "#" + h.id,
                })),
            }),
          }}
        />
      )}
      <ArticleRelated
        type="blog"
        currentSlug={initialPost.slug}
        currentTags={initialPost.frontmatter.tags}
        currentCategory={initialPost.frontmatter.category}
        initialRelatedContent={initialRelatedContent}
        dictionary={dictionary}
      />
    </div>
  );
}
