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
    <footer className="w-full mt-20 border-t border-border/40 bg-background pt-8 pb-14">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-muted-foreground">
        {/* Brand & Clean Copyright */}
        <div className="flex items-center gap-3">
          <SheetHubLogo className="w-5 h-5 opacity-80" />
          <span className="font-display font-bold text-sm tracking-tight text-foreground">
            SheetHub
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span className="text-xs text-muted-foreground/70 font-sans">
            &copy; {new Date().getFullYear()} SheetHub Docs. All rights reserved.
          </span>
        </div>

        {/* Minimal Nav Links */}
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
