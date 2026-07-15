'use client';

import { useEffect } from 'react';

/**
 * Reports Core Web Vitals (LCP, CLS, INP) to the console and prepares
 * the data pipeline for future analytics integration (GA4, Firebase, etc.).
 *
 * Loads lazily during idle time to avoid impacting performance.
 *
 * To wire up a real analytics backend, replace the `send` function below
 * with a call to your analytics SDK (e.g. gtag, firebase.analytics()).
 */
export function WebVitalsReporter() {
  useEffect(() => {
    const report = () => {
      import('web-vitals').then(({ onCLS, onINP, onLCP }) => {
        const send = (metric: { name: string; value: number; id: string }) => {
          // Log to console for development / manual monitoring
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Web Vitals] ${metric.name}:`, metric.value);
          }

          // ── Future: send to analytics backend ──────────────────────────
          // const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
          // if (typeof gtag === 'function') {
          //   gtag('event', metric.name, {
          //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          //     event_label: metric.id,
          //     non_interaction: true,
          //   });
          // }

          // ── Future: send via navigator.sendBeacon ──────────────────────
          // const payload = JSON.stringify({ name: metric.name, value: metric.value, id: metric.id });
          // navigator.sendBeacon('/api/vitals', payload);
        };

        onCLS(send);
        onINP(send);
        onLCP(send);
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(report, { timeout: 5000 });
    } else {
      setTimeout(report, 3000);
    }
  }, []);

  return null;
}
