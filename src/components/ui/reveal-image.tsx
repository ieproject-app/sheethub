"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealImageProps extends Omit<ImageProps, "onLoad"> {
  wrapperClassName?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  revealDurationMs?: number;
  holdUntilLoaded?: boolean;
  initialVisitOnly?: boolean;
  showSkeleton?: boolean;
}

export function RevealImage({
  alt,
  className,
  wrapperClassName,
  imageClassName,
  placeholderClassName,
  revealDurationMs = 320,
  holdUntilLoaded = true,
  initialVisitOnly = false,
  showSkeleton = true,
  priority,
  loading,
  sizes,
  ...props
}: RevealImageProps) {
  const srcKey = String(props.src);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!initialVisitOnly || typeof window === "undefined") return;
    const visitKey = "sheethub-initial-visit-complete";
    if (window.sessionStorage.getItem(visitKey) !== "1") {
      window.sessionStorage.setItem(visitKey, "1");
    }
  }, [initialVisitOnly]);

  const shouldHold = useMemo(() => {
    if (!initialVisitOnly) return holdUntilLoaded;
    if (typeof window === "undefined") return holdUntilLoaded;

    const visitKey = "sheethub-initial-visit-complete";
    const hasVisited = window.sessionStorage.getItem(visitKey) === "1";
    return holdUntilLoaded && !hasVisited;
  }, [holdUntilLoaded, initialVisitOnly]);

  const isLoaded = loadedSrc === srcKey;

  const shouldHideImage = shouldHold && !isLoaded;
  const shouldShowPlaceholder = !isLoaded && (shouldHold || showSkeleton);

  const mergedImageClassName = useMemo(
    () =>
      cn(
        "object-cover will-change-transform",
        shouldHold
          ? "transition-opacity ease-out"
          : "transition-opacity duration-300 ease-out",
        shouldHideImage ? "opacity-0" : "opacity-100",
        className,
        imageClassName,
      ),
    [className, imageClassName, shouldHideImage, shouldHold],
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden", wrapperClassName)}>
      {shouldShowPlaceholder && (
        <div
          className={cn(
            "skeleton absolute inset-0 z-10",
            showSkeleton ? "" : "bg-muted",
            placeholderClassName,
          )}
          data-variant={showSkeleton ? "shimmer" : "static"}
          aria-hidden="true"
        />
      )}

      <Image
        alt={alt}
        className={mergedImageClassName}
        priority={priority}
        loading={loading}
        sizes={sizes}
        onLoad={() => setLoadedSrc(srcKey)}
        {...props}
        style={{
          ...(props.style ?? {}),
          transitionDuration: `${revealDurationMs}ms`,
        }}
      />
    </div>
  );
}
