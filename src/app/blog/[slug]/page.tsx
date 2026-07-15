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
import { extractHeadings } from "@/lib/mdx-utils";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";

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

  const ogImageUrl = "https://sheethub.web.id/opengraph-image";

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
      images: [ogImageUrl],
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

  const itemForMeta = {
    slug: initialPost.slug,
    title: initialPost.frontmatter.title,
    description: initialPost.frontmatter.description,
    href: "/blog/" + initialPost.slug,
    type: "blog" as const,
  };

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24">
        <article>
          <header className="mb-12 text-center">
            <LayoutBreadcrumbs
              segments={breadcrumbSegments}
              className="mb-6 justify-center"
            />

            <h1 className="font-display text-h1 font-extrabold tracking-tighter text-primary mb-6 max-w-3xl mx-auto">
              {initialPost.frontmatter.title}
            </h1>

            <ArticleMeta
              frontmatter={initialPost.frontmatter}
              item={itemForMeta}
              dictionary={dictionary}
              readingTime={readingTime}
              isOverlay={false}
              isCentered={true}
            />
          </header>

          <div className="max-w-3xl mx-auto">
            <ArticleTOC
              headings={headings}
              title="Table of Contents"
            />

            <div className="text-lg text-foreground/80 prose-content">
              <MDXRemote
                source={initialPost.content || ""}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
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

            <div className="mt-16 flex flex-col gap-4 text-center border-t pt-12">
              <h3 className="text-lg font-semibold tracking-tight text-primary">
                Share this article
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
          </div>
        </article>
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
	              "name": "SheetHub",
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
