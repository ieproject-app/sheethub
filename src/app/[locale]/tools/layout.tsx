import { notFound } from "next/navigation";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

export default function ToolsSegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!FEATURE_FLAGS.toolsEnabled) {
    notFound();
  }

  return children;
}
