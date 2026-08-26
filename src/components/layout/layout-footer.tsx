"use client";

import Link from "next/link";
import { SheetHubLogo } from "@/components/icons/sheethub-logo";
import type { Dictionary } from "@/lib/get-dictionary";

export function LayoutFooter({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  const footerNavItems = [
    {
      id: "footer-terms",
      title: dictionary.navigation.terms,
      href: "/terms",
    },
    {
      id: "footer-privacy",
      title: dictionary.navigation.privacy,
      href: "/privacy",
    },
    {
      id: "footer-disclaimer",
      title: dictionary.navigation.disclaimer,
      href: "/disclaimer",
    },
    {
      id: "footer-contact",
      title: dictionary.navigation.contact,
      href: "/contact",
    },
    {
      id: "footer-about",
      title: "About",
      href: "/about",
    },
  ];

  return (
    <footer className="w-full mt-20 border-t border-border/40 bg-background pt-10 pb-16">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs font-sans text-muted-foreground">
        {/* Left Column: Larger Icon + 2-Line Brand Info */}
        <div className="flex items-center gap-3.5">
          <SheetHubLogo className="w-9 h-9 shrink-0 shadow-xs" />
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base tracking-tight text-foreground leading-tight">
              SheetHub
            </span>
            <span className="text-[11px] text-muted-foreground/75 font-sans mt-0.5">
              &copy; {new Date().getFullYear()} SheetHub Docs. All rights reserved.
            </span>
          </div>
        </div>

        {/* Right Column: Minimal Nav Links */}
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 md:pt-0">
          {footerNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
