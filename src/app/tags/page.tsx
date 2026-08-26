import { getAllTags } from "@/lib/tags";
import Link from "next/link";
import { Hash, ArrowRight } from "lucide-react";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse articles by topic — Excel, Google Sheets, formulas, automation, and more.",
  alternates: { canonical: "/tags" },
  robots: { index: true, follow: true },
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="w-full">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-24">
        <header className="mb-10 text-left border-b border-border/60 pb-8">
          <LayoutBreadcrumbs
            segments={[
              { label: "Home", href: "/" },
              { label: "Topics" },
            ]}
            className="mb-4"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-3">
            <span>Tag Taxonomy</span>
            <span>•</span>
            <span>{tags.length} Topics</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Explore by Topic
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
            Index of topics covering Excel functions, Google Sheets scripts, pivot tables, dynamic arrays, and productivity tips.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={"/tags/" + encodeURIComponent(tag.name.toLowerCase())}
              className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-muted/50 text-foreground group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors shrink-0">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {tag.name}
                  </h2>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {tag.count} {tag.count === 1 ? "article" : "articles"}
                  </p>
                </div>
              </div>
              <div className="rounded-lg p-1.5 text-muted-foreground transition-all duration-300 group-hover:text-emerald-500 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
            <p className="text-muted-foreground text-sm">No topics yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
