"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "sheethub-consent-v2";
const CONSENT_EVENT = "sheethub-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(CONSENT_KEY) ?? "";
  } catch {
    // Storage unavailable (e.g. blocked) → treat as undecided.
    return "";
  }
}

// Non-empty marker so the banner stays hidden during SSR and the hydration
// pass; afterwards the client snapshot ("") wins and the banner appears.
function getServerSnapshot(): string {
  return "hydrating";
}

type ConsentDecision = "accepted" | "essential-only";

/**
 * Lightweight consent banner compatible with Google Consent Mode v2.
 *
 * - First visit: ad/analytics storage is denied by default (inline script in
 *   the root layout) and this banner is shown.
 * - Accept: grants ad_storage/ad_user_data/ad_personalization/analytics_storage.
 * - Essential only: keeps them denied.
 * - No external CMP dependency; decision persists in localStorage.
 */
export function ConsentBanner() {
  const decision = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const decide = (choice: ConsentDecision) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Ignore persistence failure; decision still applies for this visit.
    }
    const granted = choice === "accepted";
    const gtag = (
      window as unknown as { gtag?: (...args: unknown[]) => void }
    ).gtag;
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
      });
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (decision !== "") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:max-w-md rounded-xl border border-border/70 bg-background/95 shadow-lg backdrop-blur p-4 sm:p-5"
    >
      <p className="text-sm font-semibold text-foreground mb-1">
        We value your privacy
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        We use cookies for essential site functions, and — with your consent —
        for analytics and personalized advertising (Google AdSense). Read our{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </a>
        . You can change your choice anytime by clearing your browser storage.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button size="sm" onClick={() => decide("accepted")} className="flex-1">
          Accept all
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => decide("essential-only")}
          className="flex-1"
        >
          Essential only
        </Button>
      </div>
    </div>
  );
}
