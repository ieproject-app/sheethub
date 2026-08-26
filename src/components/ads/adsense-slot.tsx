"use client";

import React, { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface AdSenseSlotProps {
  id: string;
  slotType: "top-leaderboard" | "in-feed" | "right-rail-sticky" | "in-article";
  label?: string;
  className?: string;
}

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getClientSnapshot() {
  if (typeof window === "undefined") return false;
  return (
    process.env.NODE_ENV !== "production" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function getServerSnapshot() {
  return false;
}

/**
 * AdSenseSlot Component
 * - In Development (localhost): Displays a clean, labeled placeholder box for layout planning.
 * - In Production (before AdSense approval/client ID): Hidden to prevent policy violations (Empty Ad Space Policy).
 * - Safe for React Hydration via useSyncExternalStore.
 */
export function AdSenseSlot({
  id,
  slotType,
  label = "Advertisement Area",
  className,
}: AdSenseSlotProps) {
  const isDev = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!isDev) {
    // Production without active ad client -> Return null (0 empty space, 0 policy risk)
    return null;
  }

  const slotDescriptions = {
    "top-leaderboard": "Reserved Responsive Leaderboard Banner Slot (728x90 / Responsive)",
    "in-feed": "Reserved In-Feed Native Display Slot (Responsive Matrix)",
    "right-rail-sticky": "Standard 300x250 Medium Rectangle / Responsive Sticky Slot",
    "in-article": "Reserved In-Article Flow Banner Slot (Responsive Content Break)",
  };

  return (
    <div
      id={id}
      className={cn(
        "w-full rounded-xl border border-dashed border-border/60 bg-muted/10 p-3 flex flex-col items-center justify-center text-center transition-colors select-none",
        slotType === "top-leaderboard" && "min-h-[90px]",
        slotType === "in-feed" && "min-h-[110px] my-6",
        slotType === "right-rail-sticky" && "min-h-[250px] min-w-[300px]",
        slotType === "in-article" && "min-h-[100px] my-8",
        className
      )}
      aria-label="Advertisement Placeholder"
    >
      <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-muted-foreground/40 mb-1">
        {label} (Dev Preview)
      </span>
      <p className="text-[10px] font-mono text-muted-foreground/50">
        {slotDescriptions[slotType]}
      </p>
    </div>
  );
}
