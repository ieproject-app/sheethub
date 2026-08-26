"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/mdx-utils";
import { ListIcon, ChevronDown } from "lucide-react";

interface ArticleTOCProps {
  headings: Heading[];
  title?: string;
  isDesktopRail?: boolean;
}

export function ArticleTOC({
  headings,
  title = "On this page",
  isDesktopRail = false,
}: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleHeadingClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
    window.history.replaceState(null, "", `#${id}`);
  };

  // Sticky Right Rail for Desktop xl+
  if (isDesktopRail) {
    return (
      <div className="w-full text-xs font-medium">
        <div className="flex items-center gap-2 mb-3 font-mono font-semibold text-muted-foreground uppercase tracking-wider">
          <ListIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>{title}</span>
        </div>
        <ul className="space-y-2 border-l border-border/80 pl-3">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li key={h.id} className={h.level === 3 ? "pl-2.5" : ""}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleHeadingClick(e, h.id)}
                  className={cn(
                    "block transition-colors py-0.5 line-clamp-1",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Mobile In-Article Collapsible TOC
  return (
    <div className="xl:hidden my-6 rounded-xl border border-border/70 bg-card/60 overflow-hidden">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="w-full flex items-center justify-between p-3.5 text-xs font-mono font-medium text-foreground hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ListIcon className="w-4 h-4 text-emerald-500" />
          <span>{title} ({headings.length} sections)</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", mobileOpen && "rotate-180")} />
      </button>

      {mobileOpen && (
        <div className="p-3.5 pt-0 border-t border-border/50 text-xs">
          <ul className="space-y-1.5 pt-2">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleHeadingClick(e, h.id)}
                  className="block text-muted-foreground hover:text-foreground py-0.5 line-clamp-1"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
