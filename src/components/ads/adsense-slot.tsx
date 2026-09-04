"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface AdSenseSlotProps {
  id: string;
  slotType: "top-leaderboard" | "in-feed" | "right-rail-sticky" | "in-article";
  adSlot?: string;
  label?: string;
  className?: string;
}

const ADSENSE_CLIENT_ID = "ca-pub-7485721934561798";

// Master switch — must match layout.tsx. When false, slots render as inert
// placeholders and no ad units are requested from Google.
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

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
 * - Master switch OFF (NEXT_PUBLIC_ADSENSE_ENABLED !== "true"): renders nothing.
 * - Master switch ON + Development (localhost): labeled placeholder for layout planning.
 * - Master switch ON + Production: official Google AdSense ins tag + adsbygoogle.push.
 * - Safe for React Hydration via useSyncExternalStore.
 */
export function AdSenseSlot({
  id,
  slotType,
  adSlot,
  label = "Advertisement Area",
  className,
}: AdSenseSlotProps) {
  const isDev = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const adsActive = ADSENSE_ENABLED && !isDev;

  // Default ad slots if not explicitly passed
  const resolvedAdSlot =
    adSlot ||
    (slotType === "in-feed"
      ? "4378551054" // home-sheethub slot
      : "8743452846"); // content-sheethub slot

  useEffect(() => {
    if (!adsActive) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [adsActive]);

  // Master switch off → no ad markup at all (clean site for re-review).
  if (!ADSENSE_ENABLED) return null;

  if (isDev) {
    const slotDescriptions = {
      "top-leaderboard": "Reserved Responsive Leaderboard Banner Slot (728x90 / Responsive)",
      "in-feed": "In-Feed Native Display Slot (home-sheethub: 4378551054)",
      "right-rail-sticky": "Right-Rail Sticky Banner (content-sheethub: 8743452846)",
      "in-article": "In-Article Content Banner (content-sheethub: 8743452846)",
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

  return (
    <div id={id} className={cn("w-full overflow-hidden text-center my-4", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={resolvedAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}