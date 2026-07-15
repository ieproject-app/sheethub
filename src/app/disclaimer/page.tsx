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
  title: "Disclaimer",
  description: "SheetHub disclaimer — information about accuracy, affiliations, and content usage.",
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: "Disclaimer | SheetHub",
    description: "SheetHub disclaimer — information about accuracy, affiliations, and content usage.",
    url: "https://sheethub.web.id/disclaimer",
    siteName: "SheetHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | SheetHub",
    description: "SheetHub disclaimer — information about accuracy, affiliations, and content usage.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
  robots: { index: true, follow: true },
};

export default async function DisclaimerPage() {
  const { frontmatter, content } = await getStaticPageData("disclaimer");

  const title =
    getStaticPageTitle(frontmatter) || "Disclaimer";
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
