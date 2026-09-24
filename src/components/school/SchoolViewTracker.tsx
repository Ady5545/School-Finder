'use client';

import { useEffect, useRef } from 'react';

interface SchoolViewTrackerProps {
  slug: string;
}

/**
 * Records a real school-profile visit.
 *
 * The server owns deduplication (30-second rapid-repeat window), so we do not
 * suppress legitimate revisits in sessionStorage. The ref only protects this
 * mounted tracker from React re-runs during the same page mount.
 */
export function SchoolViewTracker({ slug }: SchoolViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!slug || trackedRef.current) return;
    trackedRef.current = true;

    fetch(`/api/schools/${slug}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {
      // Analytics failures must never block the school profile.
    });
  }, [slug]);

  return null;
}
