import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(MODULE_DIR, "..", "..");
const POSTS_DIRECTORY = path.join(PROJECT_ROOT, "_posts");
const PAGES_DIRECTORY = path.join(PROJECT_ROOT, "_pages");

export const CONTENT_DIRECTORIES = {
  posts: POSTS_DIRECTORY,
  pages: PAGES_DIRECTORY,
} as const;

// ─── Shared MDX file helpers ────────────────────────────────────────────────

export type MdxFileEntry = { filePath: string; slug: string };

export function getAllMdxFiles(dir: string): MdxFileEntry[] {
  if (!fs.existsSync(dir)) return [];
  const results: MdxFileEntry[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...getAllMdxFiles(fullPath));
      } else if (entry.name.endsWith(".mdx")) {
        results.push({
          filePath: fullPath,
          slug: path.basename(entry.name, ".mdx"),
        });
      }
    }
  } catch (err) {
    console.error("Error reading directory:", dir, err);
  }
  return results;
}

export function findMdxFilePath(dir: string, slug: string): string | null {
  if (!fs.existsSync(dir)) return null;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findMdxFilePath(fullPath, slug);
        if (found) return found;
      } else if (entry.name.endsWith(".mdx") && path.basename(entry.name, ".mdx") === slug) {
        return fullPath;
      }
    }
  } catch (err) {
    console.error("Error finding file:", slug, err);
  }
  return null;
}

// ─── Shared types ───────────────────────────────────────────────────────────

export type BaseFrontmatter = {
  title: string;
  date: string;
  updated?: string;
  description: string;
  published?: boolean;
  tags?: string[];
  category?: string;
  [key: string]: unknown;
};

export type ContentItem<TFrontmatter> = {
  slug: string;
  frontmatter: TFrontmatter;
};

export type ContentData<TFrontmatter> = {
  slug: string;
  frontmatter: TFrontmatter;
  content: string;
};

type GetContentOptions = {
  includeDrafts?: boolean;
};

// ─── Content engine factory ─────────────────────────────────────────────────

export type ContentEngineConfig<TFrontmatter extends BaseFrontmatter> = {
  contentDirectory: string;
  normaliseFrontmatter?: (data: Record<string, unknown>) => TFrontmatter | null;
};

function clampFutureDate<T extends BaseFrontmatter>(fm: T): T {
  if (!fm || !fm.date) return fm;
  const targetTime = new Date(fm.date).getTime();
  const now = new Date();
  if (!isNaN(targetTime) && targetTime > now.getTime()) {
    const todayStr = now.toISOString().split("T")[0];
    return { ...fm, date: todayStr };
  }
  return fm;
}

export function createContentEngine<TFrontmatter extends BaseFrontmatter>(
  config: ContentEngineConfig<TFrontmatter>,
) {
  const { contentDirectory, normaliseFrontmatter } = config;

  async function getSortedData(
    options: GetContentOptions = {},
  ): Promise<ContentItem<TFrontmatter>[]> {
    const { includeDrafts = false } = options;

    if (!fs.existsSync(contentDirectory)) return [];

    const mdxFiles = getAllMdxFiles(contentDirectory);

    const allItems = mdxFiles
      .map(({ filePath, slug }) => {
        try {
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);

          const fm = normaliseFrontmatter
            ? normaliseFrontmatter(data)
            : (data as TFrontmatter);

          if (!fm) return null;

          return { slug, frontmatter: clampFutureDate(fm) };
        } catch (err) {
          console.error("Error reading MDX file:", filePath, err);
          return null;
        }
      })
      .filter((item): item is ContentItem<TFrontmatter> => item !== null)
      .filter((item) => includeDrafts || item.frontmatter.published === true);

    return allItems.sort((a, b) => {
      const da = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const db = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return db - da;
    });
  }

  async function getData(
    slug: string,
  ): Promise<ContentData<TFrontmatter> | null> {
    const foundPath = findMdxFilePath(contentDirectory, slug);

    if (!foundPath) return null;

    try {
      const fileContents = fs.readFileSync(foundPath, "utf8");
      const { data, content } = matter(fileContents);
      const isPublished = data.published === true;

      if (!isPublished && process.env.NODE_ENV !== "development") {
        return null;
      }

      const fm = normaliseFrontmatter
        ? normaliseFrontmatter(data)
        : (data as TFrontmatter);

      if (!fm) return null;

      return { slug, frontmatter: clampFutureDate(fm), content };
    } catch (err) {
      console.error("Error reading MDX content:", foundPath, err);
      return null;
    }
  }

  async function getAllSlugs(): Promise<{ slug: string }[]> {
    if (!fs.existsSync(contentDirectory)) return [];

    const mdxFiles = getAllMdxFiles(contentDirectory);

    return mdxFiles
      .map(({ filePath, slug }) => {
        try {
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data } = matter(fileContents);
          if (data.published === true) {
            return { slug };
          }
          return null;
        } catch (err) {
          console.error("Error reading MDX for slug list:", filePath, err);
          return null;
        }
      })
      .filter((item): item is { slug: string } => item !== null);
  }

  return { getSortedData, getData, getAllSlugs };
}
