// Unit tests for lib/chatbot/rate-limit.ts
// Run with: node --experimental-strip-types --test __tests__/chatbot/rate-limit.test.ts
//
// Uses Date.now() mocking to freeze time without external dependencies.

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { check, _resetForTest } from "../../lib/chatbot/rate-limit.ts";
import {
  RATE_LIMIT_PER_HOUR,
  RATE_LIMIT_INTERVAL_MS,
} from "../../lib/chatbot/config.ts";

// ── Time mocking helpers ──────────────────────────────────────────────────

let frozenNow = Date.now();
const originalDateNow = Date.now.bind(Date);

function freezeTime(ms: number): void {
  frozenNow = ms;
  Date.now = () => frozenNow;
}

function advanceTime(deltaMs: number): void {
  frozenNow += deltaMs;
}

function restoreTime(): void {
  Date.now = originalDateNow;
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("rate-limit: check()", () => {
  beforeEach(() => {
    _resetForTest();
    freezeTime(1_000_000); // arbitrary stable start
  });

  afterEach(() => {
    restoreTime();
  });

  it("allows a single request from a new IP", () => {
    const result = check("1.2.3.4");
    assert.deepStrictEqual(result, { ok: true });
  });

  it("allows up to RATE_LIMIT_PER_HOUR requests within the hour", () => {
    for (let i = 0; i < RATE_LIMIT_PER_HOUR; i++) {
      advanceTime(RATE_LIMIT_INTERVAL_MS); // stay within 2 s gap
      const result = check("10.0.0.1");
      assert.ok(result.ok, `Request ${i + 1} should be allowed`);
    }
  });

  it("rejects immediately after the short interval is violated", () => {
    check("5.5.5.5"); // first request passes
    // Advance by less than the short interval
    advanceTime(RATE_LIMIT_INTERVAL_MS - 1);
    const result = check("5.5.5.5");
    assert.strictEqual(result.ok, false);
    if (!result.ok) {
      assert.ok(
        result.retryAfterSeconds >= 1,
        "retryAfterSeconds must be ≥ 1"
      );
    }
  });

  it("allows a second request after the short interval elapses", () => {
    check("6.6.6.6");
    advanceTime(RATE_LIMIT_INTERVAL_MS);
    const result = check("6.6.6.6");
    assert.deepStrictEqual(result, { ok: true });
  });

  it("rejects when the hourly limit is hit", () => {
    // Exhaust the hourly limit
    for (let i = 0; i < RATE_LIMIT_PER_HOUR; i++) {
      advanceTime(RATE_LIMIT_INTERVAL_MS);
      check("7.7.7.7");
    }
    // One more — should be rejected
    advanceTime(RATE_LIMIT_INTERVAL_MS);
    const result = check("7.7.7.7");
    assert.strictEqual(result.ok, false);
    if (!result.ok) {
      assert.ok(result.retryAfterSeconds > 0);
    }
  });

  it("resets the hourly window after 1 hour", () => {
    // Exhaust the hourly limit
    for (let i = 0; i < RATE_LIMIT_PER_HOUR; i++) {
      advanceTime(RATE_LIMIT_INTERVAL_MS);
      check("8.8.8.8");
    }
    // Advance past the hour window
    advanceTime(3_600_001);
    const result = check("8.8.8.8");
    assert.deepStrictEqual(result, { ok: true });
  });

  it("does not share buckets across different IPs", () => {
    // Exhaust limits for IP A
    for (let i = 0; i < RATE_LIMIT_PER_HOUR; i++) {
      advanceTime(RATE_LIMIT_INTERVAL_MS);
      check("ip-a");
    }
    // IP B should still be allowed
    advanceTime(RATE_LIMIT_INTERVAL_MS);
    const result = check("ip-b");
    assert.deepStrictEqual(result, { ok: true });
  });

  it("GC removes stale buckets older than 1 hour", () => {
    // Create a bucket for an IP
    check("stale-ip");
    // Advance past GC threshold (> 1 hour idle + > 1 minute for GC trigger)
    advanceTime(3_601_000 + 61_000);
    // Trigger GC by making a request from a different IP
    check("trigger-gc-ip");
    // stale-ip bucket should be gone — so the next check starts fresh (ok)
    advanceTime(RATE_LIMIT_INTERVAL_MS);
    const result = check("stale-ip");
    assert.deepStrictEqual(result, { ok: true });
  });
});
