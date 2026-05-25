"use client";

import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isStreaming: boolean;
}

/**
 * Single chat bubble.
 * User messages: right-aligned, surface-elevated background.
 * Assistant messages: left-aligned, no background, prose text.
 */
export default function ChatMessage({
  message,
  isLastAssistant,
  isStreaming,
}: ChatMessageProps) {
  const text = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");

  const isUser = message.role === "user";
  const showCaret = isLastAssistant && isStreaming && !isUser;

  return (
    <div
      className={[
        "flex",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "rounded-md px-3 py-2 text-sm leading-relaxed break-words",
          isUser
            ? "bg-[#2C2925] text-[#F7F5F0] max-w-[80%]"
            : "bg-surface-elevated text-text-primary max-w-[92%]",
        ].join(" ")}
      >
        {text}
        {showCaret && (
          <span
            aria-hidden="true"
            className="inline-block w-px h-[1em] bg-accent ml-0.5 align-middle animate-blink motion-reduce:animate-none"
          />
        )}
      </div>
    </div>
  );
}
