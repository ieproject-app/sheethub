import { LayoutFooter } from "@/components/layout/layout-footer";
import { LayoutBackToTop } from "@/components/layout/back-to-top";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ReadArticlesProvider } from "@/hooks/use-read-articles";
import { NotificationProvider } from "@/hooks/use-notification";
import dictionary from "@/dictionaries/en.json";

import {
  Manrope,
  Plus_Jakarta_Sans,
  Lora,
  JetBrains_Mono,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter";
import { ConsentBanner } from "@/components/consent/consent-banner";

// AdSense master switch — frozen since 4 Sep 2026 (AdSense "Low value content"
// verdict). Re-enable via apphosting.yaml only after the re-application gate.
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

const fontDisplay = Manrope({
  subsets: ["latin"],
  variable: "--gf-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--gf-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--gf-serif",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--gf-mono",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sheethub.web.id"),
  title: {
    default: "SheetHub - Excel and Google Sheets: Tutorials, Formulas, and Quick Updates",
    template: "%s | SheetHub",
  },
  description:
    "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
  authors: [{ name: "SheetHub" }],
  creator: "SheetHub",
  publisher: "SheetHub",
  icons: {
    icon: [
      {
        url: "/images/logo/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      { url: "/images/logo/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/logo/favicon.ico",
    apple: "/images/logo/apple-touch-icon.png",
  },
  manifest: "/images/logo/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sheethub.web.id",
    siteName: "SheetHub",
    title:
      "SheetHub - Excel and Google Sheets: Tutorials, Formulas, and Quick Updates",
    description:
      "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
    images: [
      {
        url: "https://sheethub.web.id/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SheetHub - Excel and Google Sheets Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "SheetHub - Excel and Google Sheets: Tutorials, Formulas, and Quick Updates",
    description:
      "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-site-verification": [
      "vxaMP4zilkOIXF62345QJBaVBuClVZykomC-7IKCCMg",
      "pjUP2xWpYPYKBOj6PnKET6YkCRjVv51OKlG5_5kfxfk",
    ],
    "msvalidate.01": "C277F538388FC1064B7236E24BE71E5C",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        fontDisplay.variable,
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,
        "scroll-smooth",
      )}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased fade-in-on-load">
        {/* Consent Mode v2 default state — inline & synchronous so it always
            runs before the (afterInteractive) ads script and any gtag load.
            Deny-by-default; ConsentBanner updates it after the user chooses. */}
        <script
          dangerouslySetInnerHTML={{
            __html: [
              "window.dataLayer=window.dataLayer||[];",
              "window.gtag=function(){window.dataLayer.push(arguments);};",
              "gtag('consent','default',{",
              "'ad_storage':'denied',",
              "'ad_user_data':'denied',",
              "'ad_personalization':'denied',",
              "'analytics_storage':'denied',",
              "'functionality_storage':'granted',",
              "'security_storage':'granted',",
              "'wait_for_update':500",
              "});",
            ].join(""),
          }}
        />
        {ADSENSE_ENABLED && (
          <Script
            id="google-adsense-script"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7485721934561798"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <WebVitalsReporter />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NotificationProvider>
            <ReadArticlesProvider>
              <AppShell>
                {children}
                <LayoutFooter dictionary={dictionary} />
              </AppShell>
              <LayoutBackToTop />
            </ReadArticlesProvider>
          </NotificationProvider>
        </ThemeProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
