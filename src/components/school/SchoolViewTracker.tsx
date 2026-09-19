'use client';

import { useEffect, useRef } from 'react';

interface SchoolViewTrackerProps {
  slug: string;
}

/**
 * SchoolViewTracker
 * Tracks school profile visits with client-side deduplication to prevent
 * accidental duplicate telemetry events on tab switches or component re-renders.
 */
export function SchoolViewTracker({ slug }: SchoolViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!slug || trackedRef.current) return;

    try {
      // Check session storage to deduplicate within the current browser tab session
      const sessionKey = `ap_viewed_${slug}`;
      const lastViewed = sessionStorage.getItem(sessionKey);
      const now = Date.now();

      // Deduplicate if viewed in the last 10 minutes in the same session
      if (lastViewed && now - parseInt(lastViewed, 10) < 10 * 60 * 1000) {
        trackedRef.current = true;
        return;
      }

      trackedRef.current = true;
      sessionStorage.setItem(sessionKey, String(now));

      fetch(`/api/schools/${slug}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
        // Silently ignore network failures for analytics
      });
    } catch {
      // Storage blocked or private browsing
      if (!trackedRef.current) {
        trackedRef.current = true;
        fetch(`/api/schools/${slug}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {});
      }
    }
  }, [slug]);

  return null;
}
