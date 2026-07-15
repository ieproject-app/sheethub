import { getSortedPostSummaries } from "@/lib/posts";
import { HomeClient } from "./home-client";
import type { Metadata } from "next";

const DOMAIN = "https://sheethub.web.id";

export const metadata: Metadata = {
  title: "SheetHub - Excel and Google Sheets: Tutorials, Formulas, and Quick Updates",
  description:
    "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
  alternates: {
    canonical: "/",
  },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DOMAIN,
    siteName: "SheetHub",
    title: "SheetHub - Excel and Google Sheets: Tutorials, Formulas, and Quick Updates",
    description:
      "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
    images: [
      {
        url: DOMAIN + "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SheetHub - Excel and Google Sheets Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SheetHub - Excel and Google Sheets: Tutorials, Formulas, and Quick Updates",
    description:
      "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
    images: [DOMAIN + "/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
};

export default async function Home() {
  const initialPosts = await getSortedPostSummaries();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": DOMAIN + "/#website",
        url: DOMAIN,
        name: "SheetHub",
        description:
          "Excel and Google Sheets tutorials, practical formula guides, and quick updates for daily workflows.",
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: DOMAIN + "/?s={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": DOMAIN + "/#organization",
        name: "SheetHub",
        url: DOMAIN,
        logo: {
          "@type": "ImageObject",
          url: DOMAIN + "/images/logo/logo.svg",
        },
        founder: {
          "@type": "Person",
          name: "SheetHub",
        },
        sameAs: [
          "https://twitter.com/sheethub",
          "https://github.com/ieproject-app/sheethub",
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialPosts={initialPosts} />
    </>
  );
}
