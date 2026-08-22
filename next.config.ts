import type { NextConfig } from "next";

const canonicalHostPattern = "(?:www\\.sheethub\\.web\\.id|.*\\.hosted\\.app|.*\\.web\\.app)";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  // Enable the React Compiler — automatically optimizes re-renders
  reactCompiler: true,
  experimental: {
    // Tree-shake only imported modules from large libraries
    optimizePackageImports: ["lucide-react", "date-fns", "framer-motion", "recharts"],
    // Enable filesystem caching for faster dev restart and repeated builds
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/((?!api/|_next/|.*\..*).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host redirects. Keep these before content redirects so
      // alternate/preview domains consolidate to sheethub.web.id.
      {
        source: "/",
        has: [{ type: "host", value: canonicalHostPattern }],
        destination: "https://sheethub.web.id/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: canonicalHostPattern }],
        destination: "https://sheethub.web.id/:path*",
        permanent: true,
      },
      // ── Locale transition: bilingual → English-only ────────────────
      // The bilingual-era posts, notes, tools, and downloads no longer
      // exist, so those old /id/* and /en/* URLs must go straight to a
      // live page — dropping only the prefix would land on a 404.
      {
        source: "/id/blog/:slug*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/en/blog/:slug*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/id/notes/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/en/notes/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/id/download/:slug*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/en/download/:slug*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/id/tools/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/tools/:path*",
        destination: "/",
        permanent: true,
      },
      // Static pages from the bilingual era (about, contact, privacy,
      // terms, disclaimer, tags) still exist — drop the locale prefix.
      {
        source: "/id/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // ── Legacy slug redirects ──────────────────────────────────────
      {
        source: "/blog/hapus-folder-onedrive-duplikat-explorer",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [64, 128, 256, 384, 512],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
