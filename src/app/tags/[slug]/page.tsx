import { getSortedPostSummaries } from "@/lib/posts";
import { getAllTags, shouldIndexTag } from "@/lib/tags";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
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
    <div className="w-full">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24">
        <header className="mb-12 text-center">
          <LayoutBreadcrumbs
            segments={[
              { label: "Home", href: "/" },
              { label: "Topics", href: "/tags" },
              { label: match.name },
            ]}
            className="mb-6 justify-center"
          />

          <div className="inline-flex items-center gap-4 rounded-2xl border border-primary/10 bg-card/60 p-6 mb-6 shadow-md">
            <span className="font-display text-5xl font-extrabold text-primary">
              {match.name.charAt(0).toUpperCase()}
            </span>
            <div className="text-left">
              <h1 className="font-display text-2xl font-bold text-primary">
                {match.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {match.count} {match.count === 1 ? "article" : "articles"}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const postFirstLetter = post.frontmatter.title.trim().charAt(0).toUpperCase();

            return (
              <Link
                key={post.slug}
                href={"/blog/" + post.slug}
                className="group block"
              >
                <div className="h-full rounded-2xl border border-primary/5 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl overflow-hidden">
                  <div className="relative aspect-[8/5] bg-gradient-to-b from-primary/80 via-primary/70 to-accent/70 flex items-center justify-center">
                    <span className="font-display text-4xl font-extrabold text-white/95">
                      {postFirstLetter || "S"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-base font-bold tracking-tight text-primary line-clamp-2 transition-colors group-hover:text-primary">
                      {post.frontmatter.title}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
