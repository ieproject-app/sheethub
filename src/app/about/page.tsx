import type { Metadata } from "next";
import { getPageContent } from "@/lib/pages";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import excelFormulaGrammar from "@/grammars/excel-formula.tmLanguage.json";
import { cvData } from "@/lib/cv-data";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Mail,
  MapPin,
  Sparkles,
  PenLine,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
  const learningRole =
    "A practical content platform for Excel, Google Sheets, and workflows you can apply immediately.";

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-14 sm:px-6 lg:px-8">
        <ScrollReveal direction="down">
          <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-linear-to-br from-primary/6 via-background to-accent/6 p-8 md:p-12">
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-accent/8 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  {data.profile.badge}
                </div>

                <h1 className="font-display text-3xl font-black tracking-tighter text-primary sm:text-4xl lg:text-5xl">
                  About SheetHub
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  How SheetHub is built: the purpose, editorial direction, and practical approach behind every guide.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Badge variant="outline" className="gap-2 bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {data.email}
                  </Badge>
                  <Badge variant="outline" className="gap-2 bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    {data.profile.companyLabel}
                  </Badge>
                  <Badge variant="outline" className="gap-2 bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {data.profile.locationLabel}
                  </Badge>
                </div>
              </div>

              <div className="flex w-full justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <div className="relative z-10 overflow-visible rounded-3xl border border-primary/12 bg-card/95 px-5 pb-6 pt-5 shadow-xl backdrop-blur-sm sm:px-6 sm:pb-7 sm:pt-6">
                    <div className="relative z-10 pt-10 text-left sm:pt-0">
                      <p className="text-[11px] font-black uppercase tracking-widest text-accent">
                        {data.profile.panelLabel}
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-primary">
                        {data.profile.brandLabel}
                      </h2>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground sm:text-sm">
                        {learningRole}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                        {data.profile.statement}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.06}>
          <section className="mt-8 mb-16">
            <div className="mx-auto max-w-4xl rounded-3xl border border-primary/10 bg-linear-to-br from-card/85 via-card/70 to-background/90 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 sm:pr-8">
                  <div className="mb-3 flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-accent" />
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-accent">
                      Signature Summary
                    </p>
                  </div>
                  <p className="text-base leading-relaxed text-foreground/75 sm:text-lg">
                    {data.summary}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <section className="mb-20">
          <ScrollReveal direction="up" delay={0.1}>
            <section className="mb-20">
              <h2 className="font-display text-2xl font-black tracking-tight text-primary">
                About SheetHub
              </h2>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <section className="mb-20">
              <div className="rounded-3xl border border-primary/10 bg-card/20 p-6 shadow-sm backdrop-blur-sm sm:p-8">
                <div className="prose-content text-lg text-foreground/80 [&>h2:first-child]:mt-0 [&>p:first-child]:mt-0">
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
                </div>
              </div>
            </section>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
