import { MetadataRoute } from "next";
import { getSitemapPostSummaries } from "@/lib/sitemap-posts";

// Sitemap must always be fresh so Googlebot never reads a stale CDN-cached version.
export const revalidate = 0;

const DOMAIN = "https://sheethub.web.id";

// Fixed date for static pages — update manually when page content changes
const STATIC_LAST_MODIFIED = new Date("2026-07-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- 1. Static Routes ---
  const staticRoutes = [
    { url: DOMAIN, priority: 1, changefreq: "daily" as const },
    { url: DOMAIN + "/blog", priority: 0.8, changefreq: "weekly" as const },
    { url: DOMAIN + "/category", priority: 0.7, changefreq: "weekly" as const },
    { url: DOMAIN + "/about", priority: 0.5, changefreq: "monthly" as const },
    { url: DOMAIN + "/contact", priority: 0.5, changefreq: "monthly" as const },
    { url: DOMAIN + "/privacy", priority: 0.5, changefreq: "monthly" as const },
    { url: DOMAIN + "/terms", priority: 0.5, changefreq: "monthly" as const },
    { url: DOMAIN + "/disclaimer", priority: 0.5, changefreq: "monthly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: route.url,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));

  // --- 2. Blog Posts ---
  const posts = await getSitemapPostSummaries();

  const blogEntries: MetadataRoute.Sitemap = posts
    .map((post) => {
      const lastModified = safeDate(
        post.frontmatter.updated || post.frontmatter.date,
      );
      if (!lastModified) return null;

      return {
        url: (DOMAIN + "/blog/" + post.slug).trim(),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return [...staticEntries, ...blogEntries];
}

function safeDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}
