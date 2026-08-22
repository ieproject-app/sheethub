import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type Loader<T> = () => Promise<{ default: ComponentType<T> }>;

/**
 * Loadable — lazy-load a component with an automatic Suspense boundary.
 *
 * - `ssr: true`  → rendered on the server + hydrated on the client
 * - `ssr: false` → skip SSR (required for components that use
 *                   browser APIs like Firebase, localStorage, etc.)
 *
 * @example
 * ```tsx
 * // Client-only (Firebase, browser APIs):
 * const FirebaseComp = Loadable(() => import("./Firebase"), {
 *   ssr: false,
 *   fallback: <Skeleton className="h-80" />,
 * });
 *
 * // SSR-enabled (heavy, but can be rendered on the server):
 * const HeavyChart = Loadable(() => import("./Chart"), {
 *   ssr: true,
 *   fallback: <ChartSkeleton />,
 * });
 * ```
 */
export function Loadable<T>(
  loader: Loader<T>,
  options?: {
    /** Fallback shown while loading */
    fallback?: React.ReactNode;
    /** Default: false — safe for most client components */
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
