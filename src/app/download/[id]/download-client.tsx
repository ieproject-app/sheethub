"use client";

import type { DownloadInfo } from "@/lib/data-downloads";
import { Button } from "@/components/ui/button";
import { Download, Cloud, FileText, ShieldCheck, ArrowRight, Info, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadClientProps {
  downloadInfo: DownloadInfo;
}

const PLATFORM_THEME: Record<
  string,
  { accent: string; bg: string; border: string; gradient: string }
> = {
  gdrive: {
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500 to-lime-500",
  },
  default: {
    accent: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    gradient: "from-primary to-accent",
  },
};

export function DownloadClient({ downloadInfo }: DownloadClientProps) {
  const theme = PLATFORM_THEME[downloadInfo.platform || "default"] || PLATFORM_THEME.default;

  const handleDownload = () => {
    window.open(downloadInfo.externalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center py-8 sm:py-12 bg-background/50">
      <main className="w-full max-w-2xl mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* File Info Card */}
          <section className="flex items-center gap-4 rounded-2xl border bg-card/40 p-5 backdrop-blur-md shadow-sm">
            <div className={cn(
              "shrink-0 flex h-14 w-14 items-center justify-center rounded-xl border shadow-sm",
              theme.bg, theme.border,
            )}>
              {downloadInfo.platform === "gdrive" ? (
                <Cloud className={cn("h-7 w-7", theme.accent)} />
              ) : (
                <FileText className={cn("h-7 w-7", theme.accent)} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
                {downloadInfo.fileName}
              </h1>
              {downloadInfo.fileSize && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {downloadInfo.fileSize} {downloadInfo.license ? `· ${downloadInfo.license}` : ""}
                </p>
              )}
            </div>
            <span className={cn(
              "shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
              theme.bg, theme.border, theme.accent,
            )}>
              <Cloud className="h-3.5 w-3.5" />
              Template
            </span>
          </section>

          {/* About Section */}
          {downloadInfo.descriptionEn && (
            <section className="rounded-2xl border bg-card/40 p-5 backdrop-blur-md shadow-sm space-y-3">
              <h2 className="font-display text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                <Info className={cn("h-4 w-4", theme.accent)} />
                About this Template
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {downloadInfo.descriptionEn}
              </p>
            </section>
          )}

          {/* Download Button */}
          <section className="rounded-2xl border bg-card/40 p-6 backdrop-blur-md shadow-sm space-y-5">
            <div className="space-y-2">
              <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                Open Template
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Click the button below to open this Google Sheets template.
                Make a copy to start editing — no sign-in required to view.
              </p>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full h-14 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99] bg-foreground text-background hover:brightness-110"
            >
              <Download className="mr-2 h-5 w-5" />
              Open in Google Sheets
              <ArrowRight className="ml-2 h-4 w-4 opacity-40" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60 font-medium">
              <ShieldCheck className={cn("h-3.5 w-3.5", theme.accent)} />
              Free template — no registration required
            </div>
          </section>

          {/* How to Use Section */}
          {downloadInfo.howToUseEn && downloadInfo.howToUseEn.length > 0 && (
            <section className="rounded-2xl border bg-card/40 p-5 backdrop-blur-md shadow-sm space-y-4">
              <h2 className="font-display text-base font-bold tracking-tight text-foreground flex items-center gap-2">
                <Layers className={cn("h-4 w-4", theme.accent)} />
                How to Use
              </h2>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {downloadInfo.howToUseEn.map((step, idx) => (
                  <li key={idx} className="flex gap-3 leading-relaxed">
                    <span className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black border",
                      theme.bg, theme.border, theme.accent,
                    )}>
                      {idx + 1}
                    </span>
                    <span className="text-foreground/80 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* File Details */}
          <section className="rounded-2xl border bg-card/40 p-5 backdrop-blur-md shadow-sm space-y-3">
            <h3 className="font-display text-sm font-bold tracking-tight text-foreground">
              File Details
            </h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-semibold bg-muted/20 text-muted-foreground w-1/3">Name</td>
                    <td className="p-3 font-medium text-foreground">{downloadInfo.fileName}</td>
                  </tr>
                  {downloadInfo.fileSize && (
                    <tr className="border-b">
                      <td className="p-3 font-semibold bg-muted/20 text-muted-foreground">Size</td>
                      <td className="p-3 text-foreground">{downloadInfo.fileSize}</td>
                    </tr>
                  )}
                  {downloadInfo.license && (
                    <tr className="border-b">
                      <td className="p-3 font-semibold bg-muted/20 text-muted-foreground">License</td>
                      <td className="p-3 text-foreground">{downloadInfo.license}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-3 font-semibold bg-muted/20 text-muted-foreground">Platform</td>
                    <td className="p-3 capitalize text-foreground">{downloadInfo.platform || "Universal"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/60">
            SheetHub &copy; {new Date().getFullYear()} &mdash; Free Excel & Google Sheets resources
          </p>
        </footer>
      </main>
    </div>
  );
}
