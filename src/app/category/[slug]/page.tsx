import { getSortedPostSummaries } from "@/lib/posts";
import { getAllCategories, normalizeCategorySlug } from "@/lib/categories";
import { notFound } from "next/navigation";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
import { FormulaCard } from "@/components/cards/formula-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeCategorySlug(slug);
  const categories = await getAllCategories();
  const match = categories.find((c) => c.slug === normalizedSlug);
  if (!match) {
    return { title: "Category Not Found", robots: { index: false, follow: false } };
  }

  return {
    title: match.name + " — Articles",
    description: "Browse all articles in the " + match.name + " category.",
    robots: { index: false, follow: true },
    alternates: { canonical: "/category/" + encodeURIComponent(normalizedSlug) },
  };
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = normalizeCategorySlug(slug);
  const categories = await getAllCategories();
  const match = categories.find((c) => c.slug === normalizedSlug);
  if (!match) notFound();

  const allPosts = await getSortedPostSummaries();
  const posts = allPosts.filter((p) => {
    if (!p.frontmatter.category) return false;
    return normalizeCategorySlug(p.frontmatter.category) === normalizedSlug;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-6 border-b border-border/40 pb-4">
        <LayoutBreadcrumbs
          segments={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/category" },
            { label: match.name },
          ]}
          className="mb-2"
        />

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
          {match.name}
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
