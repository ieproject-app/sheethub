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
      // Old /id/* URLs redirect to English equivalents
      {
        source: "/id/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // Old /en/* URLs (if any were indexed) redirect to clean paths
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // ── Legacy slug redirects ──────────────────────────────────────
      {
        source: "/blog/hapus-folder-onedrive-duplikat-explorer",
        destination: "/blog/remove-duplicate-onedrive-windows-11",
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
