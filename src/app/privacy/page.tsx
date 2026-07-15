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
  title: "Privacy Policy",
  description: "SheetHub privacy policy — covering cookies, analytics, and how we handle your data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | SheetHub",
    description: "SheetHub privacy policy — covering cookies, analytics, and how we handle your data.",
    url: "https://sheethub.web.id/privacy",
    siteName: "SheetHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | SheetHub",
    description: "SheetHub privacy policy — covering cookies, analytics, and how we handle your data.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const { frontmatter, content } = await getStaticPageData("privacy");

  const title =
    getStaticPageTitle(frontmatter) || "Privacy Policy";
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
