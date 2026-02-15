import { i18n } from '@/i18n-config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all posts and notes.',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  const content: {[key: string]: any} = {
    en: {
        title: "Archive",
        description: "This page is under construction."
    },
    id: {
        title: "Arsip",
        description: "Halaman ini sedang dalam tahap pembuatan."
    }
  }
  const pageContent = content[locale] || content['en'];

  return (
    <div className="w-full">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <header className="mb-12 text-center">
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary mb-3">
                {pageContent.title}
            </h1>
        </header>
        <p className="text-center text-muted-foreground">{pageContent.description}</p>
      </main>
    </div>
  );
}
