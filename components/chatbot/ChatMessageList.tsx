"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { UIMessage } from "ai";
import ChatMessage from "./ChatMessage";

interface ChatMessageListProps {
  messages: UIMessage[];
  isStreaming: boolean;
  children?: ReactNode;
}

/**
 * Scrollable message list with smart auto-scroll.
 * Scrolls to the bottom when a new message arrives *unless* the user has
 * manually scrolled up — in that case a "jump to latest" button appears.
 * aria-live="polite" announces completed assistant messages to screen readers.
 */
export default function ChatMessageList({
  messages,
  isStreaming,
  children,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const prevLengthRef = useRef(messages.length);

  // Detect manual scroll-up
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      setUserScrolledUp(distanceFromBottom > 60);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll when a new message is added or streaming content arrives
  useEffect(() => {
    const newMessageAdded = messages.length !== prevLengthRef.current;
    prevLengthRef.current = messages.length;

    const el = containerRef.current;
    if (newMessageAdded) {
      setUserScrolledUp(false);
      el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else if (isStreaming && !userScrolledUp) {
      el?.scrollTo({ top: el.scrollHeight, behavior: "instant" });
    }
  }, [messages, isStreaming, userScrolledUp]);

  const lastAssistantIndex = messages.reduce(
    (last, msg, i) => (msg.role === "assistant" ? i : last),
    -1
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="relative h-full flex flex-col">
      {/* Greeting — visible only before first message */}
      {isEmpty && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-text-secondary leading-relaxed">
            Hi — I am Oscar&apos;s portfolio assistant. Ask me about his work,
            writing, or how to get in touch.
          </p>
        </div>
      )}

      {/* Suggested question chips */}
      {isEmpty && children}

      {/* Message list */}
      <div
        ref={containerRef}
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat conversation"
        className={[
          "flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth",
          isEmpty ? "hidden" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {messages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isLastAssistant={i === lastAssistantIndex}
            isStreaming={isStreaming}
          />
        ))}
        {isStreaming && messages.at(-1)?.role === "user" && (
          <div className="flex justify-start" aria-label="Assistant is thinking">
            <div className="rounded-md px-3 py-2 bg-surface-elevated flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Jump to latest button */}
      {userScrolledUp && !isEmpty && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={() => {
              const el = containerRef.current;
              setUserScrolledUp(false);
              el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
            }}
            className="pointer-events-auto text-xs bg-surface-elevated border border-border text-text-secondary hover:text-text-primary px-3 py-1 rounded-full transition-colors shadow-sm"
          >
            Jump to latest
          </button>
        </div>
      )}
    </div>
  );
}
