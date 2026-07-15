import { getSortedPostSummaries } from "./posts";
import { slugify } from "./slugify";

export type CategoryInfo = {
  slug: string;
  name: string;
  count: number;
};

export function normalizeCategorySlug(value: string): string {
  return slugify(decodeURIComponent(value).trim().toLowerCase());
}

export async function getAllCategories(): Promise<CategoryInfo[]> {
  const posts = await getSortedPostSummaries();
  const categoryMap = new Map<string, { name: string; count: number }>();

  posts.forEach((post) => {
    const raw = post.frontmatter.category;
    if (typeof raw !== "string" || !raw.trim()) return;
    const name = raw.trim();
    const slug = normalizeCategorySlug(name);
    if (!slug) return;

    const existing = categoryMap.get(slug) ?? { name, count: 0 };
    existing.count += 1;
    categoryMap.set(slug, existing);
  });

  return Array.from(categoryMap.entries())
    .map(([slug, data]) => ({ slug, name: data.name, count: data.count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
