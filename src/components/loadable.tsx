import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type Loader<T> = () => Promise<{ default: ComponentType<T> }>;

/**
 * Loadable — lazy-load komponen dengan Suspense boundary otomatis.
 *
 * - `ssr: true`  → di-render server + hydrasi di client
 * - `ssr: false` → skip SSR (wajib buat komponen yg pakai
 *                   browser API seperti Firebase, localStorage, dll)
 *
 * @example
 * ```tsx
 * // Client-only (Firebase, browser APIs):
 * const FirebaseComp = Loadable(() => import("./Firebase"), {
 *   ssr: false,
 *   fallback: <Skeleton className="h-80" />,
 * });
 *
 * // SSR-enabled (berat, tapi bisa di-render server):
 * const HeavyChart = Loadable(() => import("./Chart"), {
 *   ssr: true,
 *   fallback: <ChartSkeleton />,
 * });
 * ```
 */
export function Loadable<T>(
  loader: Loader<T>,
  options?: {
    /** Fallback yang muncul selama loading */
    fallback?: React.ReactNode;
    /** Default: false — aman buat kebanyakan client components */
    ssr?: boolean;
  },
): ComponentType<T> {
  const fallback = options?.fallback ?? null;
  const ssr = options?.ssr ?? false;

  return dynamic(loader, {
    ssr,
    loading: fallback !== null ? () => <>{fallback}</> : undefined,
  }) as ComponentType<T>;
}
