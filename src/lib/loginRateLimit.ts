// Best-effort, in-memory brute-force protection for password login attempts.
// This is intentionally simple (no external dependency, no schema change):
// it's per-server-instance rather than globally distributed, so on a
// multi-instance deployment a determined attacker could spread attempts
// across instances - but it still meaningfully raises the bar against the
// common case (a script hammering one account through one warm instance),
// which today has zero rate limiting at all.

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  count: number;
  firstAttemptAt: number;
}

const attempts = new Map<string, AttemptRecord>();

// Opportunistic cleanup so this map doesn't grow unbounded over a long-lived
// server process - runs on access rather than a timer, so it costs nothing
// when the app is idle.
function pruneExpired(key: string, record: AttemptRecord | undefined): AttemptRecord | undefined {
  if (!record) return undefined;
  if (Date.now() - record.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return undefined;
  }
  return record;
}

export function isLoginRateLimited(email: string): { limited: boolean; retryAfterSeconds?: number } {
  const key = email.trim().toLowerCase();
  const record = pruneExpired(key, attempts.get(key));
  if (record && record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (Date.now() - record.firstAttemptAt)) / 1000);
    return { limited: true, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }
  return { limited: false };
}

export function recordFailedLoginAttempt(email: string): void {
  const key = email.trim().toLowerCase();
  const record = pruneExpired(key, attempts.get(key));
  if (record) {
    record.count += 1;
  } else {
    attempts.set(key, { count: 1, firstAttemptAt: Date.now() });
  }
}

export function clearLoginAttempts(email: string): void {
  attempts.delete(email.trim().toLowerCase());
}
