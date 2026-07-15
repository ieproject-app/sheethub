import { createContentEngine, CONTENT_DIRECTORIES } from "@/lib/content-engine";
import type { ContentItem, ContentData } from "@/lib/content-engine";

export type PostFrontmatter = {
  title: string;
  date: string;
  updated?: string;
  description: string;
  heroImage?: string;
  imageAlt?: string;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  category?: string;
  [key: string]: unknown;
};

export type Post<T = PostFrontmatter> = ContentItem<T>;
export type PostData = ContentData<PostFrontmatter>;
export type PostGeneric = Post;
export type PostSummary = Post<PostFrontmatter>;

const postsEngine = createContentEngine<PostFrontmatter>({
  contentDirectory: CONTENT_DIRECTORIES.posts,
});

export const getSortedPostsData = postsEngine.getSortedData;
export const getPostData = postsEngine.getData;
export const getAllPostSlugs = postsEngine.getAllSlugs;
export const getSortedPostSummaries = getSortedPostsData;
