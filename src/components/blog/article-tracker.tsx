"use client";

import { useEffect } from "react";
import { useReadArticles } from "@/hooks/use-read-articles";

export function ArticleTracker({ slug }: { slug: string }) {
  const { markAsRead } = useReadArticles();

  useEffect(() => {
    if (!slug) return;

    // Mark as read after a realistic reading threshold (e.g. 3 seconds or user engagement)
    const timer = setTimeout(() => {
      markAsRead(slug);
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug, markAsRead]);

  return null;
}
