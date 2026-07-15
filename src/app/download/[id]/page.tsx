import type { Metadata } from "next";
import { downloadLinks } from "@/lib/data-downloads";
import { notFound } from "next/navigation";
import { DownloadClient } from "./download-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const info = downloadLinks[id];

  if (!info) {
    return { title: "File Not Found" };
  }

  return {
    title: `Download: ${info.fileName}`,
    description: `Download ${info.fileName} — ${info.fileSize || "free template"} from SheetHub.`,
    robots: { index: true, follow: true },
    alternates: { canonical: "/download/" + id },
    openGraph: {
      title: `Download: ${info.fileName}`,
      description: `Download ${info.fileName} — ${info.fileSize || "free template"} from SheetHub.`,
      url: "https://sheethub.web.id/download/" + id,
      type: "website",
    },
  };
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return Object.keys(downloadLinks).map((id) => ({ id }));
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const downloadInfo = downloadLinks[id];

  if (!downloadInfo) notFound();

  return <DownloadClient downloadInfo={downloadInfo} />;
}
