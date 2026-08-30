import { ImageResponse } from "next/og";
import { getPostData } from "@/lib/posts";
import { ArticleOGContent } from "@/components/og/article-og";

export const alt = "SheetHub — Excel & Google Sheets Tutorials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender one card per article at build time (the page segment already
// enumerates all published slugs via generateStaticParams).
export const dynamic = "force-static";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostData(slug);

  // Unpublished/unknown slugs never reach prerender (dynamicParams = false on
  // the page), but keep a branded fallback so the route never renders empty.
  if (!post) {
    return new ImageResponse(
      <ArticleOGContent title="Excel & Google Sheets Tutorials" />,
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <ArticleOGContent
        title={post.frontmatter.title}
        category={post.frontmatter.category}
      />
    ),
    { ...size },
  );
}
