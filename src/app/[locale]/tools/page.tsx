import { i18n, type Locale } from '@/i18n-config';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';
import React from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ToolsList } from '@/components/tools/tools-list';
import { Badge } from '@/components/ui/badge';
import { Grid2X2, FileSpreadsheet, Workflow } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const canonicalPath =
    locale === i18n.defaultLocale ? "/tools" : `/${locale}/tools`;
  const languages: Record<string, string> = {};
  i18n.locales.forEach((loc) => {
    const prefix = loc === i18n.defaultLocale ? "" : `/${loc}`;
    languages[loc] = `${prefix}/tools`;
  });

  return {
    title: dictionary.tools.title,
    description: dictionary.tools.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...languages,
        "x-default": languages[i18n.defaultLocale] || canonicalPath,
      },
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const pageContent = dictionary.tools;
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="w-full">
      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 lg:px-8">
        <ScrollReveal direction="down">
          <header className="mb-16 overflow-hidden rounded-[2rem] border border-primary/10 bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,253,244,0.92))] px-6 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] lg:items-end">
              <div className="space-y-5">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em]">
                  {pageContent.hero_kicker}
                </Badge>
                <div className="space-y-3">
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary/55">
                    {pageContent.title}
                  </p>
                  <h1 className="max-w-3xl font-display text-4xl font-black tracking-tight text-primary sm:text-5xl lg:text-6xl">
                    {pageContent.hero_title}
                  </h1>
                  <p className="max-w-2xl text-base font-medium leading-7 text-primary/70 sm:text-lg">
                    {pageContent.hero_body}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-primary/10 bg-white/75 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2 text-primary/60">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">{pageContent.hero_scope_label}</span>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-primary/80">{pageContent.hero_scope_value}</p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-white/75 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2 text-primary/60">
                    <Grid2X2 className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">{pageContent.hero_access_label}</span>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-primary/80">{pageContent.hero_access_value}</p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-white/75 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2 text-primary/60">
                    <Workflow className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.24em]">{pageContent.hero_workflow_label}</span>
                  </div>
                  <p className="text-sm font-semibold leading-6 text-primary/80">{pageContent.hero_workflow_value}</p>
                </div>
              </div>
            </div>
          </header>
        </ScrollReveal>

        <ToolsList 
          dictionary={dictionary} 
          locale={locale} 
          isDevelopment={isDevelopment} 
        />
      </main>
    </div>
  );
}
