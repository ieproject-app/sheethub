'use client';

import React, { createContext, useContext, useState, useSyncExternalStore, useCallback } from 'react';

type ReadArticlesState = {
  [pathOrSlug: string]: number; // timestamp in ms when read
};

interface ReadArticlesContextType {
  readMap: ReadArticlesState;
  isMounted: boolean;
  markAsRead: (pathOrSlug: string) => void;
  isRead: (pathOrSlug: string) => boolean;
}

const ReadArticlesContext = createContext<ReadArticlesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sheethub_read_articles_v1';
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days retention

function emptySubscribe() {
  return () => {};
}

function getInitialReadState(): ReadArticlesState {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return {};
    const parsed: ReadArticlesState = JSON.parse(stored);
    const now = Date.now();
    const valid: ReadArticlesState = {};

    Object.entries(parsed).forEach(([key, timestamp]) => {
      if (typeof timestamp === 'number' && now - timestamp < EXPIRY_MS) {
        valid[key] = timestamp;
      }
    });

    return valid;
  } catch {
    return {};
  }
}

export function ReadArticlesProvider({ children }: { children: React.ReactNode }) {
  const [readMap, setReadMap] = useState<ReadArticlesState>(getInitialReadState);
  
  // Hydration-safe mount tracker via useSyncExternalStore
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const markAsRead = useCallback((pathOrSlug: string) => {
    if (!pathOrSlug) return;
    const cleanKey = pathOrSlug.startsWith('/') ? pathOrSlug : `/blog/${pathOrSlug}`;

    setReadMap((prev) => {
      if (prev[cleanKey]) return prev;
      const updated = { ...prev, [cleanKey]: Date.now() };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage quota full or disabled
      }
      return updated;
    });
  }, []);

  const isRead = useCallback(
    (pathOrSlug: string) => {
      if (!isMounted || !pathOrSlug) return false;
      const cleanKey = pathOrSlug.startsWith('/') ? pathOrSlug : `/blog/${pathOrSlug}`;
      return !!readMap[cleanKey];
    },
    [isMounted, readMap]
  );

  return (
    <ReadArticlesContext.Provider value={{ readMap, isMounted, markAsRead, isRead }}>
      {children}
    </ReadArticlesContext.Provider>
  );
}

export function useReadArticles() {
  const context = useContext(ReadArticlesContext);
  if (!context) {
    return {
      readMap: {},
      isMounted: false,
      markAsRead: () => {},
      isRead: () => false,
    };
  }
  return context;
}
