"use client";

import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface HomeTransitionNoteProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HomeTransitionNote({
  eyebrow,
  title,
  subtitle,
  description,
  ctaText,
  ctaHref,
}: HomeTransitionNoteProps) {
  return (
    <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <ScrollReveal direction="up">
        <div className="relative rounded-xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-xs overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>{eyebrow}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 font-medium">
                {subtitle}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {description}
              </p>
            </div>

            {ctaText && ctaHref && (
              <div className="shrink-0">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background font-medium text-xs sm:text-sm hover:opacity-90 transition-all shadow-sm"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}