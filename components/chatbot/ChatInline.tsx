"use client";

import { useRef, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatErrorState } from "@/lib/chatbot/types";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";

export default function ChatInline() {
  const [errorState, setErrorState] = useState<ChatErrorState>(null);
  const [chatKey, setChatKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error, stop, regenerate, setMessages } = useChat({
    id: `chat-inline-${chatKey}`,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      try {
        const data: unknown = JSON.parse(err.message);
        if (
          data !== null &&
          typeof data === "object" &&
          "error" in data &&
          (data as Record<string, unknown>).error === "rate_limited"
        ) {
          const retryAfter =
            typeof (data as Record<string, unknown>).retryAfter === "number"
              ? ((data as Record<string, unknown>).retryAfter as number)
              : 60;
          setErrorState({ type: "rate_limited", retryAfterSeconds: retryAfter });
          return;
        }
      } catch {
        // Not JSON
      }
      setErrorState({ type: "error" });
    },
  });

  const handleSendMessage = useCallback(
    (text: string) => {
      setErrorState(null);
      sendMessage({ text });
      setTimeout(() => textareaRef.current?.focus(), 50);
    },
    [sendMessage]
  );

  const handleRetry = useCallback(() => {
    setErrorState(null);
    regenerate();
  }, [regenerate]);

  const handleReset = useCallback(() => {
    setMessages([]);
    setErrorState(null);
    setChatKey((k) => k + 1);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [setMessages]);

  const isActive = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  const displayError: ChatErrorState =
    errorState ?? (error ? { type: "error" } : null);

  return (
    /* Double-bezel outer shell */
    <div className="p-[1px] rounded-[calc(var(--radius-lg)+1px)] bg-gradient-to-b from-black/[0.08] to-black/[0.02]">
    {/* Inner content card */}
    <div className="flex flex-col rounded-[var(--radius-lg)] bg-surface overflow-hidden shadow-[inset_0_1px_0_rgba(0,0,0,0.03)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className={[
              "w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300",
              isActive ? "bg-accent animate-pulse" : "bg-text-secondary/40",
            ].join(" ")}
          />
          <span className="text-[11px] font-semibold text-text-secondary tracking-[0.10em] uppercase">
            Oscar&apos;s assistant
          </span>
        </div>

        {hasMessages && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            New conversation
          </button>
        )}
      </div>

      {/* Empty state: initial assistant message + chips */}
      {!hasMessages && (
        <div className="flex flex-col min-h-[240px] justify-between">
          <div className="px-5 pt-5 pb-1 space-y-3">
            {/* Faux initial assistant message */}
            <div className="flex justify-start">
              <div className="rounded-md px-3 py-2.5 text-sm leading-relaxed text-text-primary max-w-[92%] bg-surface-elevated">
                Hi — I&apos;m Oscar&apos;s assistant. Ask me about his work,
                availability, or anything you&apos;d normally ask him directly.
              </div>
            </div>
          </div>
          <SuggestedQuestions onSelect={handleSendMessage} disabled={isActive} />
        </div>
      )}

      {/* Message list — fixed height, scrolls internally */}
      {hasMessages && (
        <div className="h-[480px] flex flex-col min-h-0">
          <ChatMessageList messages={messages} isStreaming={isActive} />
        </div>
      )}

      {/* Error banner */}
      {displayError && (
        <div className="px-5 py-2 border-t border-border shrink-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-red-400">
              {displayError.type === "rate_limited"
                ? `Too many questions — wait ${displayError.retryAfterSeconds}s, or `
                : "Something went wrong — retry, or "}
              <a
                href="mailto:oscarmdzgarcia@gmail.com"
                className="underline hover:text-red-300 transition-colors"
              >
                email Oscar
              </a>
              .
            </p>
            {displayError.type === "error" && (
              <button
                type="button"
                onClick={handleRetry}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors underline shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput
        textareaRef={textareaRef}
        onSend={handleSendMessage}
        onStop={stop}
        isStreaming={isActive}
      />
    </div>
    </div>
  );
}
