import type { Metadata } from "next";
import {
  getStaticPageData,
  getStaticPageDescription,
  getStaticPageLastUpdated,
  getStaticPageTitle,
} from "@/lib/static-pages";
import {
  LayoutStaticPageTemplate,
  resolveStaticPageIcon,
} from "@/components/layout/static-page-template";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SheetHub terms and conditions — guidelines for using our content and services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | SheetHub",
    description: "SheetHub terms and conditions — guidelines for using our content and services.",
    url: "https://sheethub.web.id/terms",
    siteName: "SheetHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | SheetHub",
    description: "SheetHub terms and conditions — guidelines for using our content and services.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
  robots: { index: true, follow: true },
};

export default async function TermsPage() {
  const { frontmatter, content } = await getStaticPageData("terms");

  const title =
    getStaticPageTitle(frontmatter) || "Terms of Service";
  const description = getStaticPageDescription(frontmatter);
  const lastUpdated = getStaticPageLastUpdated(frontmatter);

  return (
    <LayoutStaticPageTemplate
      title={title}
      description={description}
      lastUpdated={lastUpdated}
      content={content}
      badgeLabel={frontmatter.badgeLabel || "Official Document"}
      icon={resolveStaticPageIcon(frontmatter.icon)}
      maxWidthClassName="max-w-3xl"
    />
  );
}
