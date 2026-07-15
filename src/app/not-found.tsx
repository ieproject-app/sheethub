import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";
import { Home, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  robots: { index: false, follow: false },
};

const navItems = [
  {
    href: "/",
    label: "Go Back Home",
    icon: Home,
  },
  {
    href: "/blog",
    label: "Browse Blog",
    icon: BookOpen,
  },
];

export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-20">
      <div className="max-w-xl mx-auto px-6 text-center">
        <header className="mb-8">
          <h1 className="font-display text-6xl font-extrabold tracking-tighter text-primary mb-4">
            404
          </h1>
          <p className="font-display text-3xl font-bold tracking-tight text-primary">
            Page Not Found
          </p>
        </header>

        <div className="mb-12">
          <p className="text-muted-foreground text-lg leading-relaxed">
            The page you are looking for might have been moved or deleted.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl h-16 group"
            >
              <Link href={href}>
                <Icon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
