import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * SheetHub is English-only, so internal links never need a locale prefix.
 */
export function getLinkPrefix(): string {
  return "";
}


export function formatRelativeTime(date: Date) {
  if (!date || isNaN(date.getTime())) {
    return "N/A";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  try {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffInSeconds) < 60)
      return rtf.format(-diffInSeconds, "second");

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60)
      return rtf.format(-diffInMinutes, "minute");

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) return rtf.format(-diffInHours, "hour");

    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) return rtf.format(-diffInDays, "day");

    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) return rtf.format(-diffInMonths, "month");

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, "year");
  } catch {
    return date.toLocaleDateString("en-US");
  }
}
