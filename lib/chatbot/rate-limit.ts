// In-memory token-bucket rate limiter keyed by IP address.
//
// NOTE: This is a per-Lambda-instance implementation. Bucket state resets on
// cold starts. In a multi-region or multi-instance deployment each instance
// enforces its own limits independently — acceptable for portfolio-level
// traffic. To get globally accurate limits, replace the `buckets` Map with a
// call to Vercel KV / Upstash Redis.

import {
  RATE_LIMIT_PER_HOUR,
  RATE_LIMIT_INTERVAL_MS,
} from "@/lib/chatbot/config";
import type { RateLimitResult } from "@/lib/chatbot/types";

const HOUR_MS = 3_600_000;
const GC_INTERVAL_MS = 60_000;

interface Bucket {
  /** Timestamp of the most recent accepted request (ms). */
  shortLastRequest: number;
  /** Number of requests accepted in the current hourly window. */
  hourlyCount: number;
  /** Start timestamp of the current hourly window (ms). */
  hourWindowStart: number;
  /** Timestamp of the last activity on this bucket (for GC). */
  lastActivity: number;
}

/** Internal bucket store — module-level singleton per Lambda instance. */
const buckets = new Map<string, Bucket>();
let lastGc = 0;

/** Remove buckets that have been idle for more than one hour. */
function gc(now: number): void {
  const staleThreshold = now - HOUR_MS;
  for (const [ip, bucket] of buckets) {
    if (bucket.lastActivity < staleThreshold) {
      buckets.delete(ip);
    }
  }
  lastGc = now;
}

/**
 * Check whether `ip` is within the rate-limit budget.
 *
 * Two windows are enforced independently:
 * - **Short**: at most 1 request per `RATE_LIMIT_INTERVAL_MS` (default 2 s).
 * - **Long**: at most `RATE_LIMIT_PER_HOUR` requests per rolling hour.
 *
 * @returns `{ ok: true }` when the request may proceed, or
 *          `{ ok: false, retryAfterSeconds }` when it must be rejected.
 */
export function check(ip: string): RateLimitResult {
  const now = Date.now();

  if (now - lastGc > GC_INTERVAL_MS) {
    gc(now);
  }

  const existing = buckets.get(ip);
  const bucket: Bucket = existing ?? {
    shortLastRequest: 0,
    hourlyCount: 0,
    hourWindowStart: now,
    lastActivity: now,
  };

  // ── Short window ──────────────────────────────────────────────────────────
  const timeSinceLast = now - bucket.shortLastRequest;
  if (timeSinceLast < RATE_LIMIT_INTERVAL_MS) {
    const retryAfterSeconds = Math.ceil(
      (RATE_LIMIT_INTERVAL_MS - timeSinceLast) / 1_000
    );
    buckets.set(ip, { ...bucket, lastActivity: now });
    return { ok: false, retryAfterSeconds };
  }

  // ── Hourly window ─────────────────────────────────────────────────────────
  let { hourlyCount, hourWindowStart } = bucket;
  const windowAge = now - hourWindowStart;

  if (windowAge >= HOUR_MS) {
    // Start a fresh window
    hourlyCount = 0;
    hourWindowStart = now;
  }

  if (hourlyCount >= RATE_LIMIT_PER_HOUR) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((HOUR_MS - windowAge) / 1_000)
    );
    buckets.set(ip, { ...bucket, lastActivity: now });
    return { ok: false, retryAfterSeconds };
  }

  // ── Allow ─────────────────────────────────────────────────────────────────
  buckets.set(ip, {
    shortLastRequest: now,
    hourlyCount: hourlyCount + 1,
    hourWindowStart,
    lastActivity: now,
  });
  return { ok: true };
}

/** Exposed for testing only — clears all bucket state. */
export function _resetForTest(): void {
  buckets.clear();
  lastGc = 0;
}
