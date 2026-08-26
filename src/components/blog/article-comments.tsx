"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useRef } from "react";
import { MessageSquare, ShieldCheck, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DiscussionEmbed = dynamic(
  () => import("disqus-react").then((mod) => mod.DiscussionEmbed),
  { ssr: false, loading: () => null },
);

const productionHostname = "sheethub.web.id";
const DISQUS_SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || "gsheets";

interface ArticleCommentsProps {
  article: {
    slug: string;
    title: string;
  };
  type: "blog" | "note";
}

export function ArticleComments({ article, type }: ArticleCommentsProps) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);

  const isProductionDomain = useMemo(() => {
    if (typeof window === "undefined") return false;

    const isProduction = process.env.NODE_ENV === "production";
    const host = window.location.hostname;
    const isCorrectDomain =
      host === productionHostname ||
      host.endsWith("." + productionHostname) ||
      host.includes("firebaseapp.com") ||
      host.includes("web.app") ||
      host.includes("hosted.app");

    return isProduction && isCorrectDomain;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCommentsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    if (commentsRef.current) {
      observer.observe(commentsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const canonicalUrl = `https://${productionHostname}/${type}/${article.slug}`;
  const disqusIdentifier = `${type}:en:${article.slug}`;

  const i18n = {
    discussion: "Discussion & Community",
    subtitle: "Share questions, tips, or edge-cases about this spreadsheet formula.",
    liveOnly: "Discussion is live on production",
    liveOnlyDesc: "To ensure comment integrity, thread loading is enabled on the live production domain.",
    openLive: "Open live discussion",
  };

  return (
    <section
      ref={commentsRef}
      className="w-full mt-12 pt-8 border-t border-border/40"
      aria-label="Discussion Area"
    >
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
            {i18n.discussion}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{i18n.subtitle}</p>
        </div>
      </div>

      <div className="w-full">
        {!commentsVisible ? (
          <div className="rounded-xl border border-border/60 bg-card/40 p-6 flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : !isProductionDomain ? (
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 flex items-start gap-3.5 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-foreground">{i18n.liveOnly}</span>
              <p className="text-muted-foreground leading-relaxed">{i18n.liveOnlyDesc}</p>
              <a
                href={canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline pt-1"
              >
                <span>{i18n.openLive}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : DISQUS_SHORTNAME.trim() ? (
          <DiscussionEmbed
            shortname={DISQUS_SHORTNAME}
            config={{
              url: canonicalUrl,
              identifier: disqusIdentifier,
              title: article.title,
              language: "en",
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
