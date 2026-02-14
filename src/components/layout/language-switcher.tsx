'use client'

import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import { i18n } from '@/i18n-config'
import { Button } from '@/components/ui/button'
import { type TranslationsMap } from '@/lib/posts'

export function LanguageSwitcher({ translationsMap }: { translationsMap: TranslationsMap }) {
  const pathName = usePathname()
  const params = useParams()
  const currentLocale = params.locale as string

  const redirectedPathName = (newLocale: string) => {
    if (!pathName) return '/'

    const isBlogPage = pathName.includes('/blog/');
    
    if (isBlogPage && translationsMap) {
      const currentSlug = pathName.split('/').pop();
      
      // Find the translation key for the current post
      let translationKey: string | null = null;
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

    // Fallback for non-blog pages or if translation is not found
    const pathIsLocalized = i18n.locales.includes(pathName.split('/')[1] as any);
    const pathWithoutLocale = pathIsLocalized ? pathName.substring(pathName.indexOf('/', 1)) : pathName;

    if (newLocale === i18n.defaultLocale) {
      return pathWithoutLocale || '/';
    }

    const newPath = `/${newLocale}${pathWithoutLocale}`;
    if (newPath !== '/' && newPath.endsWith('/')) {
      return newPath.slice(0, -1);
    }
    return newPath;
  }

  return (
    <div className="flex gap-1 items-center">
      {i18n.locales.map((locale) => {
        const isActive = currentLocale === locale;
        return (
          <Button
            key={locale}
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className={`transition-all ${isActive ? 'ring-2 ring-ring' : ''}`}
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
