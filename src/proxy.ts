import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy/middleware for SheetHub.
 *
 * English-only site, so no locale routing. This middleware:
 * - Redirects alternate hostnames (www, Firebase preview, etc.) to the canonical domain
 * - Passes through API routes, Next.js internals, and static files
 *
 * No cookie-based redirects. Cookie-dependent redirects that get cached
 * by the CDN without Vary: Cookie can poison Googlebot and kill indexing.
 */

const CANONICAL_HOST = "sheethub.web.id";

// Hostname patterns that should redirect to the canonical domain.
// Add any preview/alternate domains here.
const alternateHostPattern =
  /^www\.sheethub\.web\.id$|\.hosted\.app$|\.web\.app$/;

export function proxy(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // ── Canonical host redirect ─────────────────────────────────────────
  // If the request comes from an alternate/preview domain, 308-redirect to
  // the canonical domain preserving the full path and query string.
  if (host !== CANONICAL_HOST && alternateHostPattern.test(host)) {
    const url = new URL(pathname, `https://${CANONICAL_HOST}`);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 308);
  }

  // Skip middleware for API routes, Next.js internal files, and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Everything else passes through — English-only, no locale handling needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|images|favicon.ico).*)",
  ],
};
