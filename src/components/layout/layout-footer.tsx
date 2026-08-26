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
    <footer className="w-full mt-16 border-t border-border/50 bg-background/50 pt-8 pb-12">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <SheetHubLogo className="w-5 h-5 opacity-70" />
          <span className="font-display font-semibold text-foreground/80">SheetHub</span>
          <span>•</span>
          <span className="text-[11px] text-muted-foreground/70">
            &copy; {new Date().getFullYear()} SheetHub Docs
          </span>
        </div>

        {/* Minimal Nav Links */}
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {footerNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
