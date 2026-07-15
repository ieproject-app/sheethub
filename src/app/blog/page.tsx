import { getSortedPostSummaries } from "@/lib/posts";
import { BlogListClient } from "./blog-list-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tutorials, formula guides, and practical tips for Excel and Google Sheets.",
  alternates: {
    canonical: "/blog",
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sheethub.web.id/blog",
    siteName: "SheetHub",
    title: "Blog | SheetHub",
    description: "Tutorials, formula guides, and practical tips for Excel and Google Sheets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | SheetHub",
    description: "Tutorials, formula guides, and practical tips for Excel and Google Sheets.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
};

export default async function BlogPage() {
  const initialPosts = await getSortedPostSummaries();
  const safePosts = Array.isArray(initialPosts) ? initialPosts : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blog",
            description: "Tutorials, formula guides, and practical tips for Excel and Google Sheets.",
            url: "https://sheethub.web.id/blog",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://sheethub.web.id/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://sheethub.web.id/blog",
              },
            ],
          }),
        }}
      />
      <BlogListClient
        initialPosts={safePosts}
      />
    </>
  );
}
