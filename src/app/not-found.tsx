import Link from "next/link";
import { Compass, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Formula or Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-16">
      <div className="max-w-md w-full mx-auto px-6 text-center flex flex-col items-center gap-5">
        {/* Error Chip */}
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-wider">
          Error: #REF! / #N/A (404)
        </span>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Page or Formula Not Found
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          The tutorial or documentation page you are looking for might have been moved, renamed, or is currently under revision.
        </p>

        {/* Quick Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Learning Roadmap</span>
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/80 text-foreground font-medium text-xs hover:bg-muted transition-colors"
          >
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span>Browse All Tutorials</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
