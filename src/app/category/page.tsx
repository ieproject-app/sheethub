import { getAllCategories } from "@/lib/categories";
import Link from "next/link";
import { FolderClosed, ArrowRight } from "lucide-react";
import { LayoutBreadcrumbs } from "@/components/layout/layout-breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse articles by category — Excel, Google Sheets, formulas, automation, and more.",
  alternates: { canonical: "/category" },
  robots: { index: true, follow: true },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="w-full">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24">
        <header className="mb-12 text-center">
          <LayoutBreadcrumbs
            segments={[
              { label: "Home", href: "/" },
              { label: "Categories" },
            ]}
            className="mb-6 justify-center"
          />

          <h1 className="font-display text-4xl font-extrabold tracking-tighter text-primary mb-4 sm:text-5xl">
            Categories
          </h1>

          <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            Browse articles by category.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={"/category/" + encodeURIComponent(category.slug)}
              className="group relative overflow-hidden rounded-2xl border border-primary/5 bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300 group-hover:bg-primary/5">
                    <FolderClosed className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-primary transition-colors group-hover:text-primary">
                      {category.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-xs font-medium text-muted-foreground/60">
                      <span>{category.count} {category.count === 1 ? "article" : "articles"}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-primary/5 p-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No categories yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
