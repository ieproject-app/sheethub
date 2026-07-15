import { getSortedPostSummaries } from "@/lib/posts";
import { getAllCategories, normalizeCategorySlug } from "@/lib/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
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
    <div className="w-full">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24">
        <header className="mb-12 text-center">
          <LayoutBreadcrumbs
            segments={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/category" },
              { label: match.name },
            ]}
            className="mb-6 justify-center"
          />

          <h1 className="font-display text-4xl font-extrabold tracking-tighter text-primary mb-4">
            {match.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {match.count} {match.count === 1 ? "article" : "articles"}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={"/blog/" + post.slug}
              className="group block"
            >
              <div className="h-full rounded-2xl border border-primary/5 bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
                <div className="flex flex-col gap-3">
                  <h2 className="font-display text-lg font-bold tracking-tight text-primary group-hover:text-primary line-clamp-2">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
