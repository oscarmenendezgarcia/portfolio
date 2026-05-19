// Shared type definitions for the chatbot feature.
// Client-side types mirror the AI SDK v6 UIMessage shape.

export type ChatRole = "user" | "assistant";

/** Result returned by the rate limiter's check() function. */
export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/**
 * Error information parsed from a failed chat API response.
 * Used by the UI to render the appropriate error state.
 */
export type ChatErrorState =
  | { type: "rate_limited"; retryAfterSeconds: number }
  | { type: "error" }
  | null;
