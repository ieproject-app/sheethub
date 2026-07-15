"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Dictionary } from "@/lib/get-dictionary";
import {
  User2,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function LayoutFooter({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  const linkPrefix = "";

  const footerNavItems = [
    {
      id: "footer-terms",
      title: dictionary.navigation.terms,
      href: `${linkPrefix}/terms`,
    },
    {
      id: "footer-privacy",
      title: dictionary.navigation.privacy,
      href: `${linkPrefix}/privacy`,
    },
    {
      id: "footer-disclaimer",
      title: dictionary.navigation.disclaimer,
      href: `${linkPrefix}/disclaimer`,
    },
    {
      id: "footer-contact",
      title: dictionary.navigation.contact,
      href: `${linkPrefix}/contact`,
    },
  ];

  const authorName = "SheetHub";
  const authorAvatar = "/images/profile/sheethub-round.svg";
  return (
    <footer className="relative w-full mt-16 sm:mt-24">
      {/* Sub-Footer Section */}
      <section
        aria-label="Footer details"
        className="relative w-full pt-20 pb-12 bg-card border-t border-primary/5 transition-all duration-300 ease-in-out"
      >
        {/* Bisected Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 z-20">
          <ScrollReveal
            direction="down"
            className="relative rounded-full ring-2 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl transition-all duration-300 ease-in-out group hover:ring-primary/40"
          >
            <Avatar className="w-24 h-24 mx-auto border-4 border-background bg-background transition-transform duration-500 group-hover:scale-105">
              <AvatarImage src={authorAvatar} alt={authorName} />
              <AvatarFallback className="bg-muted text-primary">
                {authorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </ScrollReveal>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h4 className="font-display text-2xl font-bold text-foreground tracking-tight">
              {authorName}
            </h4>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed font-medium animate-in fade-in duration-700">
              {dictionary.footer.authorBio}
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href={`${linkPrefix}/about`}
                className="group/btn relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/10 text-primary text-[13px] font-bold transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-sm"
              >
                <User2 className="h-4 w-4" />
                <span>{dictionary.footer.viewProfile}</span>
              </Link>
            </div>
          </ScrollReveal>

          <div className="flex flex-col justify-center items-center gap-6 text-sm text-primary/80 border-t border-primary/10 pt-12 mt-12">
            <div className="flex items-center gap-4">
            </div>
            
            <div className="flex flex-col items-center justify-center gap-5 text-center">
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-2.5 rounded-full bg-muted/20 border border-primary/5 backdrop-blur-sm">
                {footerNavItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-accent transition-all duration-300"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
              
              <small className="font-extrabold tracking-widest text-[10px] uppercase text-primary/30 hover:text-primary transition-colors duration-300">
                &copy; {new Date().getFullYear()} SheetHub. All Rights Reserved.
              </small>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
