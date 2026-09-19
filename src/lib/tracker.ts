/**
 * Lightweight client activity telemetry helper
 * Dispatches tracking events to /api/activity/track asynchronously
 */
export function trackClientSearch(query: string, locality?: string, resultsCount?: number): void {
  if (!query || query.trim().length < 2) return;
  try {
    fetch('/api/activity/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'search_performed',
        query: query.trim(),
        locality,
        resultsCount,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Fail silently in client
  }
}

export function trackClientCompare(schoolSlugs: string[]): void {
  if (!Array.isArray(schoolSlugs) || schoolSlugs.length === 0) return;
  try {
    fetch('/api/activity/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'compare_view',
        schoolSlugs,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Fail silently in client
  }
}
