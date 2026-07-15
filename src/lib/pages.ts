import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { CONTENT_DIRECTORIES } from '@/lib/content-engine';

const pagesDirectory = CONTENT_DIRECTORIES.pages;

export type PageData = {
  frontmatter: Record<string, string | number | boolean | string[] | null | undefined>;
  content: string;
};

export async function getPageContent(pageName: string): Promise<PageData> {
  const fullPath = path.join(pagesDirectory, pageName, 'en.mdx');

  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return { frontmatter: data, content };
}
