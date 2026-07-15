import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages";

export type StaticPageSlug =
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "disclaimer";

export type StaticPageFrontmatter = {
  title?: string;
  description?: string;
  lastUpdated?: string;
  seoTitle?: string;
  badgeLabel?: string;
  icon?: string;
  [key: string]: string | number | boolean | string[] | null | undefined;
};

export type StaticPageData = {
  frontmatter: StaticPageFrontmatter;
  content: string;
};

export async function getStaticPageData(
  slug: StaticPageSlug,
): Promise<StaticPageData> {
  const page = await getPageContent(slug);
  return {
    frontmatter: (page.frontmatter ?? {}) as StaticPageFrontmatter,
    content: page.content,
  };
}

export async function generateStaticPageMetadata({
  slug,
  fallbackTitle,
  fallbackDescription,
  robots,
}: {
  slug: StaticPageSlug;
  fallbackTitle?: string;
  fallbackDescription?: string;
  robots?: Metadata["robots"];
}): Promise<Metadata> {
  const { frontmatter } = await getStaticPageData(slug);
  const title = frontmatter.seoTitle || frontmatter.title || fallbackTitle;
  const description = frontmatter.description || fallbackDescription;
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: "/" + slug,
    },
  };
}


export function getStaticPageLastUpdated(
  frontmatter: StaticPageFrontmatter,
): string | undefined {
  return typeof frontmatter.lastUpdated === "string"
    ? frontmatter.lastUpdated
    : undefined;
}

export function getStaticPageTitle(
  frontmatter: StaticPageFrontmatter,
  fallback?: string,
): string | undefined {
  if (typeof frontmatter.title === "string" && frontmatter.title.trim()) {
    return frontmatter.title;
  }
  return fallback;
}

export function getStaticPageDescription(
  frontmatter: StaticPageFrontmatter,
  fallback?: string,
): string | undefined {
  if (typeof frontmatter.description === "string" && frontmatter.description.trim()) {
    return frontmatter.description;
  }
  return fallback;
}
