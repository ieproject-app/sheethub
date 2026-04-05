"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  ScrollText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/get-dictionary";

type ToolCardConfig = {
  id: string;
  icon: React.ReactElement<{ className?: string }>;
  badge?: string;
  badgeVariant?: React.ComponentProps<typeof Badge>['variant'];
  isLink?: boolean;
  href?: string;
};

interface ToolsListProps {
  dictionary: Dictionary;
  locale: string;
  isDevelopment: boolean;
}

export function ToolsList({ dictionary, locale, isDevelopment }: ToolsListProps) {
  const pageContent = dictionary.tools;
  const linkPrefix = locale === "en" ? "" : `/${locale}`;

  const internalTools: ToolCardConfig[] = [
    {
      id: "address_label",
      icon: <ScrollText className="h-8 w-8" />,
      isLink: true,
      href: `${linkPrefix}/tools/address-label-generator`,
      badge: pageContent.open_tool,
      badgeVariant: "secondary" as const,
    },
  ];

  const developmentTools: ToolCardConfig[] = isDevelopment
    ? [
        {
          id: "ai_prompt_generator",
          icon: <Sparkles className="h-8 w-8" />,
          isLink: true,
          href: `${linkPrefix}/tools/prompt-generator`,
          badge: pageContent.open_tool,
          badgeVariant: "secondary" as const,
        },
      ]
    : [];

  const renderCard = (
    tool: ToolCardConfig,
    isClickable: boolean = false
  ) => {
    const toolContent = pageContent.tool_list[tool.id as keyof typeof pageContent.tool_list];
    const isComingSoon = !tool.badge;
    const badgeText = tool.badge || pageContent.coming_soon;
    const badgeVariant = tool.badgeVariant || 'outline';

    const content = (
      <Card
        className={cn(
          "flex h-full flex-col bg-card/50 transition-all duration-300 shadow-sm border-primary/5 overflow-hidden",
          isClickable
            ? "group cursor-pointer hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] active:scale-[0.98]"
            : "opacity-75 cursor-not-allowed grayscale"
        )}
      >
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg tracking-tight text-primary font-display font-bold group-hover:text-accent transition-colors">
                {toolContent.title}
              </CardTitle>
            </div>
            <Badge variant={badgeVariant} className={cn(isComingSoon && "opacity-60", "text-[10px] font-bold tracking-tight")}>
              {badgeText}
            </Badge>
          </div>
          {React.cloneElement(tool.icon, {
            className: cn(
              "h-8 w-8 text-primary/40 transition-all duration-500",
              isClickable ? "group-hover:text-accent group-hover:scale-110 group-hover:rotate-6" : "opacity-30"
            )
          })}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {toolContent.description}
          </p>
          {isClickable && (
            <div className="mt-4 flex justify-end">
              <div className="p-2 rounded-full bg-primary/5 group-hover:bg-accent/10 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-primary/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );

    if (isClickable && tool.href) {
      return (
        <Link href={tool.href} className="block h-full no-underline">
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <div className="space-y-20">
      <section className="relative">
        <ScrollReveal direction="right">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2 rounded-xl transition-colors duration-500 bg-emerald-500/10">
                <ScrollText className="h-5 w-5 transition-colors duration-500 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black font-display text-primary uppercase tracking-tighter">
                  {pageContent.spreadsheet_section_title}
                </h2>
                <p className="max-w-xl text-sm font-medium leading-6 text-muted-foreground/80">
                  {pageContent.spreadsheet_section_desc}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full animate-pulse bg-emerald-500" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 italic">
                    {locale === "id" ? "Akses Konten Aktif" : "Content Access Active"}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-px bg-primary/5 flex-1" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700">
          {internalTools.map((tool, index) => (
            <ScrollReveal key={tool.id} delay={index * 0.1} direction="up">
              {renderCard(tool, tool.isLink)}
            </ScrollReveal>
          ))}
        </div>
      </section>

      {developmentTools.length > 0 && (
        <section>
          <ScrollReveal direction="up">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black font-display text-primary uppercase tracking-tighter">
                    {pageContent.editorial_section_title}
                  </h2>
                  <p className="max-w-xl text-sm font-medium leading-6 text-muted-foreground/80">
                    {pageContent.editorial_section_desc}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    {locale === "id" ? "Khusus Mode Pengembangan" : "Development Mode Only"}
                  </p>
                </div>
              </div>
              <div className="h-px bg-primary/5 flex-1" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {developmentTools.map((tool, index) => (
              <ScrollReveal key={tool.id} delay={index * 0.1} direction="up">
                {renderCard(tool, tool.isLink)}
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
