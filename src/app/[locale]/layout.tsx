import { Header } from '@/components/layout/header';
import { i18n } from '@/i18n-config';
import { getAllTranslationsMap } from '@/lib/posts';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const translationsMap = getAllTranslationsMap();
  return (
    <div lang={params.locale}>
      <Header translationsMap={translationsMap} />
      <main>{children}</main>
    </div>
  );
}
