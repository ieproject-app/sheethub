'use client';

/**
 * RelativeTime — Hydration-safe relative time component.
 *
 * Problem it solves:
 *   Calling `new Date()` (i.e. "now") during SSR produces a slightly different
 *   timestamp than when the client hydrates milliseconds later. React detects
 *   the mismatch and throws a hydration warning in dev mode ("1 Issue").
 *
 * Solution:
 *   - On the server (and on first client render), output a static locale date
 *     string (e.g. "24 Mar 2026") — server and client agree on this.
 *   - After the component mounts on the client, switch to the relative string
 *     (e.g. "3 days ago") via useEffect. This update never conflicts with SSR.
 *
 * Usage:
 *   // Instead of: {formatRelativeTime(new Date(post.frontmatter.date))}
 *   <RelativeTime date={post.frontmatter.date} />
 */

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/utils';

interface RelativeTimeProps {
  /** ISO date string or Date object */
  date: string | Date;
  /** Optional className forwarded to the wrapping <time> element */
  className?: string;
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  // Static date string — identical on server and initial client render.
  const staticDate = parsedDate.toLocaleDateString(
    'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' },
  );

  const [display, setDisplay] = useState(staticDate);

  // After hydration, switch to the human-friendly relative string.
  useEffect(() => {
    setDisplay(formatRelativeTime(parsedDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <time
      dateTime={parsedDate.toISOString()}
      suppressHydrationWarning
      className={className}
    >
      {display}
    </time>
  );
}
