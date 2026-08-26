import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import excelFormulaGrammar from "@/grammars/excel-formula.tmLanguage.json";
import { cvData } from "@/lib/cv-data";

export const metadata: Metadata = {
  title: "About SheetHub",
  description: "How SheetHub is built: the purpose, editorial direction, and practical approach behind every guide.",
  alternates: { canonical: "/about" },
  openGraph: {
    siteName: "SheetHub",
    title: "About SheetHub",
    description: "How SheetHub is built: the purpose, editorial direction, and practical approach behind every guide.",
    url: "https://sheethub.web.id/about",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SheetHub",
    description: "How SheetHub is built: the purpose, editorial direction, and practical approach behind every guide.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
  robots: { index: true, follow: true },
};

export default async function AboutPage() {
  const { content } = await getPageContent("about");
  const data = cvData.en;

  return (
    <div className="w-full py-4">
      {/* Hyper-Minimalist Technical Docs Canvas (Fixed ~800px) */}
      <div className="w-full max-w-[800px]">
        {/* Document Header */}
        <header className="mb-8 pb-6 border-b border-border/40">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 block">
            About SheetHub
          </span>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Editorial Direction & Standards
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
            How SheetHub is built: the purpose, editorial philosophy, and practical approach behind every spreadsheet formula guide.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground/80">
            <span>Contact: <strong className="text-foreground">{data.email}</strong></span>
            <span>•</span>
            <span>Platform: <strong className="text-foreground">{data.profile.brandLabel}</strong></span>
          </div>
        </header>

        {/* Pure Flowing MDX Prose (Zero Card Wrappers) */}
        <article className="prose-content text-base sm:text-lg text-foreground/90 leading-relaxed">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypeShiki, {
                  theme: "github-dark",
                  langs: [excelFormulaGrammar],
                  langAlias: { excel: "excel-formula" },
                  fallbackLanguage: "text",
                }]],
              },
            }}
          />
        </article>
      </div>
    </div>
  );
}
