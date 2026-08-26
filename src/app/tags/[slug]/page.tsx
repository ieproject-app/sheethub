import { getSortedPostSummaries } from "@/lib/posts";
import { getAllTags, shouldIndexTag } from "@/lib/tags";
import { notFound } from "next/navigation";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
import { FormulaCard } from "@/components/cards/formula-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const tags = await getAllTags();
  const match = tags.find((t) => t.name.toLowerCase() === decodedSlug);

  if (!match) {
    return { title: "Topic Not Found", robots: { index: false, follow: false } };
  }

  return {
    title: `${match.name} — Articles`,
    description: `Browse all articles tagged with "${match.name}".`,
    robots: shouldIndexTag(match.name, match.count)
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: "/tags/" + encodeURIComponent(decodedSlug) },
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ slug: t.name.toLowerCase() }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const tags = await getAllTags();
  const match = tags.find((t) => t.name.toLowerCase() === decodedSlug);

  if (!match) notFound();

  const allPosts = await getSortedPostSummaries();
  const posts = allPosts.filter((p) =>
    p.frontmatter.tags?.some((t: string) => t.toLowerCase() === decodedSlug),
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-6 border-b border-border/40 pb-4">
        <LayoutBreadcrumbs
          segments={[
            { label: "Home", href: "/" },
            { label: "Topics", href: "/tags" },
            { label: match.name },
          ]}
          className="mb-2"
        />

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
          #{match.name}
        </h1>
        <p className="text-xs font-mono text-muted-foreground/70">
          {posts.length} {posts.length === 1 ? "formula guide" : "formula guides"}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {posts.map((post) => (
          <FormulaCard
            key={post.slug}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
