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
  title: "Contact",
  description: "Get in touch with SheetHub — questions, suggestions, or collaboration.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | SheetHub",
    description: "Get in touch with SheetHub — questions, suggestions, or collaboration.",
    url: "https://sheethub.web.id/contact",
    siteName: "SheetHub",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | SheetHub",
    description: "Get in touch with SheetHub — questions, suggestions, or collaboration.",
    images: ["https://sheethub.web.id/opengraph-image"],
    creator: "@sheethub",
    site: "@sheethub",
  },
  robots: { index: true, follow: true },
};

export default async function ContactPage() {
  const { frontmatter, content } = await getStaticPageData("contact");

  const title =
    getStaticPageTitle(frontmatter) || "Contact";
  const description = getStaticPageDescription(frontmatter);
  const lastUpdated = getStaticPageLastUpdated(frontmatter);

  return (
    <LayoutStaticPageTemplate
      title={title}
      description={description}
      lastUpdated={lastUpdated}
      content={content}
      badgeLabel={frontmatter.badgeLabel || "Contact"}
      icon={resolveStaticPageIcon(frontmatter.icon)}
      maxWidthClassName="max-w-3xl"
    />
  );
}
