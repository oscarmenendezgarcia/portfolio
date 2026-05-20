// Integration tests for app/api/chat/route.ts
//
// Tests all validation / error paths: 400, 429, 503.
// NOTE: The 200 streaming path and 502 upstream-error path require ESM module
// mocking (mock.module) which is not available in Node.js v23 native test runner.
// Those paths are covered by E2E Playwright tests (see agent-docs/ai-chatbot/).
//
// Run: node --experimental-strip-types --experimental-loader './__tests__/loader.mjs' \
//          --test '__tests__/chatbot/route.test.ts'

import { describe, it, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { check, _resetForTest as resetRateLimit } from "../../lib/chatbot/rate-limit.ts";
import {
  MAX_MESSAGES,
  MAX_INPUT_CHARS,
  MAX_PAYLOAD_BYTES,
} from "../../lib/chatbot/config.ts";

// Dynamic import so the module is loaded once after this file's top-level
// code runs. The `ai` / `@ai-sdk/google` packages are loaded but never
// invoked for the error paths tested here — no network calls are made.
const { POST } = await import("../../app/api/chat/route.ts");

// ── Helpers ───────────────────────────────────────────────────────────────

type TextPart = { type: "text"; text: string };
type MockMsg = {
  id: string;
  role: "user" | "assistant";
  parts: TextPart[];
  createdAt: Date;
};

function makeMsg(role: "user" | "assistant", text = "Hello"): MockMsg {
  return {
    id: `msg-${Math.random().toString(36).slice(2)}`,
    role,
    parts: [{ type: "text", text }],
    createdAt: new Date(),
  };
}

/** Build a JSON Request for the /api/chat endpoint. */
function makeReq(
  body: unknown,
  extraHeaders: Record<string, string> = {}
): Request {
  const json = JSON.stringify(body);
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(json.length),
      ...extraHeaders,
    },
    body: json,
  });
}

const VALID_BODY = {
  id: "conv-test-001",
  messages: [makeMsg("user", "What projects are you working on?")],
};

// ── Test suite ─────────────────────────────────────────────────────────────

describe("POST /api/chat — route handler", () => {
  // Save + restore the API key env var so tests are isolated
  const savedApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  after(() => {
    if (savedApiKey !== undefined) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = savedApiKey;
    } else {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    }
    resetRateLimit();
  });

  beforeEach(() => {
    resetRateLimit();
    // Default: key present so tests reach the validation layer
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-api-key";
  });

  // ── 503 — missing API key ────────────────────────────────────────────────
  describe("503 — service misconfigured", () => {
    it("returns 503 with error=misconfigured when API key is absent", async () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      const res = await POST(makeReq(VALID_BODY) as never);
      assert.strictEqual(res.status, 503);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "misconfigured");
    });
  });

  // ── 400 — validation errors ──────────────────────────────────────────────
  describe("400 — request validation", () => {
    it("returns 400 for a malformed JSON body", async () => {
      const req = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ bad json }",
      });
      const res = await POST(req as never);
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "invalid_request");
    });

    it("returns 400 when id is not a string", async () => {
      const res = await POST(
        makeReq({ id: 42, messages: [makeMsg("user")] }) as never
      );
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "invalid_request");
    });

    it("returns 400 when id exceeds 64 characters", async () => {
      const res = await POST(
        makeReq({ id: "x".repeat(65), messages: [makeMsg("user")] }) as never
      );
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string; detail: string };
      assert.strictEqual(data.error, "invalid_request");
      assert.ok(
        data.detail.includes("64"),
        `detail should mention 64 chars, got: "${data.detail}"`
      );
    });

    it("returns 400 when messages is missing", async () => {
      const res = await POST(makeReq({ id: "test" }) as never);
      assert.strictEqual(res.status, 400);
    });

    it("returns 400 when messages is not an array", async () => {
      const res = await POST(
        makeReq({ id: "test", messages: "not-an-array" }) as never
      );
      assert.strictEqual(res.status, 400);
    });

    it("returns 400 when messages array is empty", async () => {
      const res = await POST(makeReq({ id: "test", messages: [] }) as never);
      assert.strictEqual(res.status, 400);
    });

    it(`returns 400 when messages array exceeds ${MAX_MESSAGES} items`, async () => {
      const msgs = Array.from({ length: MAX_MESSAGES + 1 }, (_, i) =>
        makeMsg(i % 2 === 0 ? "user" : "assistant")
      );
      // Ensure last message is always user (to isolate this specific error)
      msgs[msgs.length - 1] = makeMsg("user");
      const res = await POST(makeReq({ id: "test", messages: msgs }) as never);
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string; detail: string };
      assert.strictEqual(data.error, "invalid_request");
      assert.ok(
        data.detail.includes(`${MAX_MESSAGES}`),
        `detail should mention ${MAX_MESSAGES}, got: "${data.detail}"`
      );
    });

    it("returns 400 when last message is not from user", async () => {
      const res = await POST(
        makeReq({
          id: "test",
          messages: [makeMsg("user", "hi"), makeMsg("assistant", "hi back")],
        }) as never
      );
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { detail: string };
      assert.ok(
        data.detail.toLowerCase().includes("last message"),
        `detail should mention last message, got: "${data.detail}"`
      );
    });

    it("returns 400 when a message has an invalid role", async () => {
      const res = await POST(
        makeReq({
          id: "test",
          messages: [
            { id: "x", role: "system", parts: [{ type: "text", text: "hi" }] },
          ],
        }) as never
      );
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "invalid_request");
    });

    it(`returns 400 when message text exceeds ${MAX_INPUT_CHARS} characters`, async () => {
      const res = await POST(
        makeReq({
          id: "test",
          messages: [makeMsg("user", "a".repeat(MAX_INPUT_CHARS + 1))],
        }) as never
      );
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { detail: string };
      assert.ok(
        data.detail.includes(`${MAX_INPUT_CHARS}`),
        `detail should mention ${MAX_INPUT_CHARS}, got: "${data.detail}"`
      );
    });

    it("returns 400 when content-length exceeds MAX_PAYLOAD_BYTES", async () => {
      // Use only the Content-Length header trick — the body itself is small
      // because the route checks the header before parsing JSON.
      const req = new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": String(MAX_PAYLOAD_BYTES + 1),
        },
        body: JSON.stringify(VALID_BODY),
      });
      const res = await POST(req as never);
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { detail: string };
      assert.ok(
        data.detail.toLowerCase().includes("large"),
        `detail should mention 'large', got: "${data.detail}"`
      );
    });

    // NOTE: A message with only non-text parts (e.g. { type: "image" }) passes
    // validation because extractText() returns "" (0 chars ≤ MAX_INPUT_CHARS).
    // Testing this path would trigger a live Google API call (the route reaches
    // streamText with the fake key), violating the "no live network calls" rule.
    // This boundary is documented as a known test coverage gap — covered by E2E.
  });

  // ── 429 — rate limited ───────────────────────────────────────────────────
  describe("429 — rate limited", () => {
    it("returns 429 with Retry-After header when short window is violated", async () => {
      const testIp = "203.0.113.42";
      // Exhaust the short window: call check() once to record shortLastRequest = now
      check(testIp);
      // Immediately hit POST with the same IP (within the 2-second window)
      const res = await POST(
        makeReq(VALID_BODY, { "x-forwarded-for": testIp }) as never
      );
      assert.strictEqual(res.status, 429);
      const data = (await res.json()) as {
        error: string;
        retryAfter: number;
      };
      assert.strictEqual(data.error, "rate_limited");
      assert.ok(
        typeof data.retryAfter === "number" && data.retryAfter >= 1,
        `retryAfter must be ≥ 1, got: ${data.retryAfter}`
      );
      assert.ok(
        res.headers.get("Retry-After") !== null,
        "Retry-After response header must be present"
      );
    });

    it("Retry-After header value matches retryAfter body field", async () => {
      const testIp = "198.51.100.7";
      check(testIp);
      const res = await POST(
        makeReq(VALID_BODY, { "x-forwarded-for": testIp }) as never
      );
      assert.strictEqual(res.status, 429);
      const data = (await res.json()) as { retryAfter: number };
      const headerVal = Number(res.headers.get("Retry-After"));
      assert.strictEqual(
        headerVal,
        data.retryAfter,
        "Retry-After header must equal body retryAfter field"
      );
    });

    it("uses x-forwarded-for first IP segment for rate-limiting", async () => {
      // Multi-IP x-forwarded-for — rate limiter should use only the first
      const testIp = "10.10.10.1";
      check(testIp);
      const res = await POST(
        makeReq(VALID_BODY, {
          "x-forwarded-for": `${testIp}, 172.16.0.1, 192.168.0.1`,
        }) as never
      );
      assert.strictEqual(
        res.status,
        429,
        "Rate limit should trigger on first IP in x-forwarded-for"
      );
    });
  });

  // ── Response shape consistency ───────────────────────────────────────────
  describe("Response shape — error payloads", () => {
    it("every 400 response has error=invalid_request", async () => {
      const badRequests = [
        { id: 123, messages: [makeMsg("user")] },
        { id: "ok", messages: "bad" },
        { id: "ok", messages: [] },
        {
          id: "ok",
          messages: [makeMsg("user", "x".repeat(MAX_INPUT_CHARS + 1))],
        },
      ];
      for (const body of badRequests) {
        resetRateLimit();
        const res = await POST(makeReq(body) as never);
        assert.strictEqual(res.status, 400);
        const data = (await res.json()) as { error: string };
        assert.strictEqual(
          data.error,
          "invalid_request",
          `Expected 'invalid_request' for body: ${JSON.stringify(body).slice(0, 60)}`
        );
      }
    });

    it("503 response has error=misconfigured and no stack trace", async () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      const res = await POST(makeReq(VALID_BODY) as never);
      const text = await res.text();
      const data = JSON.parse(text) as { error: string };
      assert.strictEqual(data.error, "misconfigured");
      // Must not leak stack trace info
      assert.ok(!text.includes("Error:"), "Response must not contain Error:");
      assert.ok(!text.includes("at "), "Response must not contain stack frames");
    });
  });
});
