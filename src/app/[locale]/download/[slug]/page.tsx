import type { Metadata } from 'next';
import { downloadLinks } from '@/lib/data-downloads';
import { notFound } from 'next/navigation';
import { DownloadClient } from './download-client';
import { i18n } from '@/i18n-config';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const downloadInfo = downloadLinks[params.slug];
  
  if (!downloadInfo) {
    return {
      title: 'File Not Found',
    }
  }

  return {
    title: `Downloading: ${downloadInfo.fileName}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export async function generateStaticParams() {
    return i18n.locales.flatMap((locale) => {
        return Object.keys(downloadLinks).map(slug => ({ slug, locale }));
    });
}

export default async function DownloadPage({ params }: { params: { slug: string, locale: string } }) {
  const downloadInfo = downloadLinks[params.slug];

  if (!downloadInfo) {
    notFound();
  }

  const dictionary = await getDictionary(params.locale);
  // You might want to replace this with your actual site name from a config or env var
  const siteName = "SnipGeek"; 

  return <DownloadClient downloadInfo={downloadInfo} dictionary={dictionary.downloadGate} siteName={siteName} />;
}
