'use client'

import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import { i18n } from '@/i18n-config'
import { Button } from '@/components/ui/button'
import { type TranslationsMap } from '@/lib/posts'

export function LanguageSwitcher({ translationsMap }: { translationsMap: TranslationsMap }) {
  const pathName = usePathname()
  const params = useParams()

  const currentLocale = (params.locale as string) || i18n.defaultLocale;
  const currentSlug = params.slug as string | undefined;

  const redirectedPathName = (newLocale: string) => {
    if (!pathName) return '/'

    // 1. Handle blog post pages
    if (currentSlug && translationsMap) {
      let translationKey: string | null = null;
      // Find the translation key for the current slug and locale
      for (const key in translationsMap) {
        const found = translationsMap[key].find(t => t.locale === currentLocale && t.slug === currentSlug);
        if (found) {
          translationKey = key;
          break;
        }
      }

      if (translationKey) {
        const targetTranslation = translationsMap[translationKey].find(t => t.locale === newLocale);
        if (targetTranslation) {
          if (newLocale === i18n.defaultLocale) {
            return `/blog/${targetTranslation.slug}`;
          }
          return `/${newLocale}/blog/${targetTranslation.slug}`;
        }
      }
    }

    // 2. Handle all other pages (homepage, etc.)
    const pathWithoutLocale = currentLocale === i18n.defaultLocale
        ? pathName
        : pathName.replace(`/${currentLocale}`, '') || '/';
    
    if (newLocale === i18n.defaultLocale) {
      return pathWithoutLocale;
    }

    return `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  }

  const isActive = (locale: string) => currentLocale === locale;

  return (
    <div className="flex gap-1 items-center">
      {i18n.locales.map((locale) => {
        return (
          <Button
            key={locale}
            variant={isActive(locale) ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className={`transition-all ${isActive(locale) ? 'ring-2 ring-ring' : ''}`}
          >
            <Link href={redirectedPathName(locale)}>
              {locale.toUpperCase()}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
