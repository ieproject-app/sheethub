import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import excelFormulaGrammar from "@/grammars/excel-formula.tmLanguage.json";
import { mdxComponents } from "@/components/mdx-components";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type StaticPageTemplateProps = {
  title: string;
  description?: string;
  lastUpdated?: string;
  content: string;
  badgeLabel?: string;
  icon?: IconComponent;
  maxWidthClassName?: string;
  footerNote?: string;
};

export function resolveStaticPageIcon(..._args: unknown[]): undefined {
  void _args;
  return undefined;
}

export function LayoutStaticPageTemplate({
  title,
  description,
  lastUpdated,
  content,
  badgeLabel = "Legal",
  footerNote,
}: StaticPageTemplateProps) {
  return (
    <div className="w-full py-4">
      {/* Hyper-Minimalist Technical Docs Canvas (Fixed ~800px) */}
      <div className="w-full max-w-[800px]">
        {/* Document Header */}
        <header className="mb-8 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {badgeLabel}
            </span>
            {lastUpdated && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs font-mono text-muted-foreground/60">
                  Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
                </span>
              </>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">
            {title}
          </h1>

          {description && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
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

        {footerNote && (
          <div className="mt-12 pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground">
            <p>{footerNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
