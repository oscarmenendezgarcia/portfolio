// POST /api/chat — streams a Gemini reply for the portfolio chatbot.
//
// Runtime: Node.js (default). Do NOT add `export const runtime = 'edge'`.
// The bottleneck is Gemini TTFT (~600-900 ms), not function cold-start.

import { streamText, convertToModelMessages, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { type NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/chatbot/persona";
import { check } from "@/lib/chatbot/rate-limit";
import {
  CHATBOT_MODEL_ID,
  MAX_INPUT_CHARS,
  MAX_MESSAGES,
  MAX_PAYLOAD_BYTES,
  GENERATION_TEMPERATURE,
  GENERATION_MAX_OUTPUT_TOKENS,
} from "@/lib/chatbot/config";

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

/** Extract the client's IP, falling back to "unknown" when not resolvable. */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

/** Pull plain text from an AI SDK UIMessage (handles parts format). */
function extractText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");
}

export async function POST(req: NextRequest): Promise<Response> {
  // ── Guard: API key must be present ────────────────────────────────────────
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error(
      JSON.stringify({
        event: "chat.misconfigured",
        detail: "Missing GOOGLE_GENERATIVE_AI_API_KEY",
      })
    );
    return Response.json({ error: "misconfigured" }, { status: 503 });
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req);
  const rl = check(ip);
  if (!rl.ok) {
    console.log(
      JSON.stringify({ event: "chat.request.rejected", reason: "rate_limited" })
    );
    return Response.json(
      { error: "rate_limited", retryAfter: rl.retryAfterSeconds },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      }
    );
  }

  // ── Payload size guard ────────────────────────────────────────────────────
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return Response.json(
      { error: "invalid_request", detail: "Payload too large" },
      { status: 400 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: { id?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "invalid_request", detail: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { id, messages } = body;

  // ── Validate id ───────────────────────────────────────────────────────────
  if (typeof id !== "string" || id.length > 64) {
    return Response.json(
      { error: "invalid_request", detail: "id must be a string ≤ 64 chars" },
      { status: 400 }
    );
  }

  // ── Validate messages array ───────────────────────────────────────────────
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      {
        error: "invalid_request",
        detail: "messages must be a non-empty array",
      },
      { status: 400 }
    );
  }

  if (messages.length > MAX_MESSAGES) {
    return Response.json(
      {
        error: "invalid_request",
        detail: `Maximum ${MAX_MESSAGES} messages allowed`,
      },
      { status: 400 }
    );
  }

  // Validate each message shape and text length.
  for (const msg of messages as UIMessage[]) {
    if (!["user", "assistant"].includes(msg.role)) {
      return Response.json(
        { error: "invalid_request", detail: "Invalid message role" },
        { status: 400 }
      );
    }
    const text = extractText(msg);
    if (text.length > MAX_INPUT_CHARS) {
      return Response.json(
        {
          error: "invalid_request",
          detail: `Message exceeds ${MAX_INPUT_CHARS} characters`,
        },
        { status: 400 }
      );
    }
  }

  const lastMsg = (messages as UIMessage[])[messages.length - 1];
  if (lastMsg.role !== "user") {
    return Response.json(
      { error: "invalid_request", detail: "Last message must be from user" },
      { status: 400 }
    );
  }

  console.log(
    JSON.stringify({
      event: "chat.request.received",
      conversationId: id,
      messageCount: (messages as UIMessage[]).length,
    })
  );

  // ── Stream ────────────────────────────────────────────────────────────────
  try {
    const system = buildSystemPrompt();

    const result = streamText({
      model: google(CHATBOT_MODEL_ID),
      system,
      messages: await convertToModelMessages(messages as UIMessage[]),
      temperature: GENERATION_TEMPERATURE,
      maxOutputTokens: GENERATION_MAX_OUTPUT_TOKENS,
    });

    const streamResponse = result.toUIMessageStreamResponse();
    const headers = new Headers(streamResponse.headers);
    headers.set("Cache-Control", "no-store");
    headers.set("X-Accel-Buffering", "no");

    console.log(
      JSON.stringify({ event: "chat.upstream.ok", conversationId: id })
    );

    return new Response(streamResponse.body, {
      status: streamResponse.status,
      headers,
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "chat.upstream.error",
        conversationId: id,
        error: String(err),
      })
    );
    return Response.json(
      {
        error: "upstream",
        message:
          "Sorry — I could not reach the model. Try again or email oscarmdzgarcia@gmail.com.",
      },
      { status: 502 }
    );
  }
}
