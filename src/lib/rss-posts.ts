import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

type RssPostSummary = {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    tags?: string[];
    updated?: string;
    published?: boolean;
  };
};

const POSTS_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..", "_posts");

function getAllPostFiles(dir: string): Array<{ filePath: string; slug: string }> {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: Array<{ filePath: string; slug: string }> = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllPostFiles(fullPath));
      continue;
    }

    if (entry.name.endsWith(".mdx")) {
      files.push({
        filePath: fullPath,
        slug: path.basename(entry.name, ".mdx"),
      });
    }
  }

  return files;
}

export async function getRssPostSummaries(): Promise<RssPostSummary[]> {
  const files = getAllPostFiles(POSTS_ROOT);
  const posts: RssPostSummary[] = [];

  for (const { filePath, slug } of files) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      if (data.published !== true) {
        continue;
      }

      posts.push({
        slug,
        frontmatter: {
          title: String(data.title || ""),
          description: String(data.description || ""),
          date: String(data.date || ""),
          updated: typeof data.updated === "string" ? data.updated : undefined,
          tags: Array.isArray(data.tags)
            ? data.tags.filter((tag): tag is string => typeof tag === "string")
            : undefined,
          published: true,
        },
      });
  }

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
  );
}