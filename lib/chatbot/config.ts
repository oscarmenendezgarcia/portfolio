// Chatbot configuration constants.
// All magic numbers live here — no hard-coding in handlers or components.

/** Google Gemini model identifier. */
export const CHATBOT_MODEL_ID = "gemini-3.1-flash-lite" as const;

/** Maximum characters allowed per message from the user. */
export const MAX_INPUT_CHARS = 1_000;

/** Maximum number of messages in the conversation history. */
export const MAX_MESSAGES = 16;

/** Maximum total POST body size in bytes. */
export const MAX_PAYLOAD_BYTES = 16_384;

/**
 * Maximum requests per hour per IP.
 * NOTE: This limit is enforced per Lambda instance in memory.
 * In a multi-region or multi-instance deployment each instance has its own
 * bucket — this is accepted for portfolio-level traffic. Migrate to Vercel KV
 * / Upstash Redis if global rate-limiting becomes necessary.
 */
export const RATE_LIMIT_PER_HOUR = 20;

/**
 * Minimum interval between consecutive requests per IP (milliseconds).
 * Enforces the short window: 1 request per 2 seconds.
 */
export const RATE_LIMIT_INTERVAL_MS = 2_000;

/** Generation temperature for Gemini. Lower = more factual. */
export const GENERATION_TEMPERATURE = 0.7;

/** Max output tokens to generate per response (AI SDK v6: maxOutputTokens). */
export const GENERATION_MAX_OUTPUT_TOKENS = 800;
