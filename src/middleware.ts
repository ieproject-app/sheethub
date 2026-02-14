import { NextRequest, NextResponse } from 'next/server';
import { i18n } from './i18n-config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, Next.js internal files, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') 
  ) {
    return;
  }
  
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If the locale is missing, this is an English (default locale) page.
  // Rewrite the path to include the 'en' locale for Next.js's router
  // while keeping the URL clean for the user.
  if (pathnameIsMissingLocale) {
    const defaultLocale = i18n.defaultLocale;
    
    return NextResponse.rewrite(
      new URL(`/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|images|favicon.ico).*)',
  ],
};
