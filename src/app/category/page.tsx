import { getAllCategories } from "@/lib/categories";
import Link from "next/link";
import { ArrowRight, Layers, FileSpreadsheet, Calculator } from "lucide-react";
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-24">
        <header className="mb-10 text-left border-b border-border/60 pb-8">
          <LayoutBreadcrumbs
            segments={[
              { label: "Home", href: "/" },
              { label: "Categories" },
            ]}
            className="mb-4"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium mb-3">
            <span>Taxonomy</span>
            <span>•</span>
            <span>{categories.length} Categories</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3">
            Categories & Domains
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
            Curated taxonomy of tutorials, workflow guides, and formula references across Excel and Google Sheets.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => {
            const isSheets = category.name.toLowerCase().includes("sheets");
            const isExcel = category.name.toLowerCase().includes("excel");
            const Icon = isSheets ? Layers : isExcel ? FileSpreadsheet : Calculator;

            return (
              <Link
                key={category.slug}
                href={"/category/" + encodeURIComponent(category.slug)}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-muted/50 text-foreground group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {category.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>{category.count} {category.count === 1 ? "article" : "articles"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg p-2 text-muted-foreground transition-all duration-300 group-hover:text-emerald-500 group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border/80 bg-card/40">
            <p className="text-muted-foreground text-sm">No categories yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
