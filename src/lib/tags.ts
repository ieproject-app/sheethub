import { getSortedPostSummaries } from "./posts";

export type TagInfo = {
  name: string;
  count: number;
};

export const INDEXABLE_TAGS = [
  "excel",
  "google-sheets",
  "spreadsheet",
  "formula",
  "automation",
  "template",
  "vba",
  "power-query",
  "pivot-tables",
  "data-analysis",
  "chart",
  "dashboard",
  "macro",
  "function",
  "conditional-formatting",
  "data-validation",
  "import",
  "export",
  "productivity",
  "tips",
  "shortcut",
] as const;

export function shouldIndexTag(tag: string, count: number): boolean {
  const normalizedTag = tag.toLowerCase();
  if (count <= 0) return false;
  if (INDEXABLE_TAGS.includes(normalizedTag as (typeof INDEXABLE_TAGS)[number])) {
    return true;
  }
  return count >= 3;
}

export async function getAllTags(): Promise<TagInfo[]> {
  const posts = await getSortedPostSummaries();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    if (post.frontmatter.tags && Array.isArray(post.frontmatter.tags)) {
      post.frontmatter.tags.forEach((tag: string) => {
        if (typeof tag !== "string") return;
        const normalizedTag = tag.trim().toLowerCase();
        if (!normalizedTag) return;
        tagMap.set(normalizedTag, (tagMap.get(normalizedTag) || 0) + 1);
      });
    }
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
