"use client";

import { useEffect, useRef, useCallback } from "react";
import type { UIMessage } from "ai";
import type { ChatErrorState } from "@/lib/chatbot/types";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: UIMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  error: ChatErrorState;
  onSendMessage: (text: string) => void;
  onStop: () => void;
  onRetry: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

/**
 * Slide-over panel that hosts the full chat experience.
 * Desktop: 400px fixed right-side panel.
 * Mobile (<768px): bottom-rising drawer at 85vh.
 * Accessibility: role=dialog, aria-modal, focus trap, Esc-to-close.
 */
export default function ChatbotPanel({
  isOpen,
  onClose,
  messages,
  status,
  error,
  onSendMessage,
  onStop,
  onRetry,
  textareaRef,
}: ChatbotPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Focus management ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Delay a tick so the panel is visible before stealing focus
      const t = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, textareaRef]);

  // ── Focus trap ───────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter((el) => !el.closest("[aria-hidden='true']"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isActive = status === "submitted" || status === "streaming";

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        id="chatbot-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chatbot-panel-title"
        aria-hidden={!isOpen}
        className={[
          // Base
          "fixed z-50 flex flex-col",
          "bg-surface border border-border shadow-2xl",
          // Desktop: right-side panel
          "md:right-6 md:bottom-24 md:w-[400px] md:h-[calc(100vh-8rem)] md:rounded-lg",
          // Mobile: bottom drawer 85vh
          "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[85vh] max-md:rounded-t-lg",
          // Visibility & animation
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0 md:translate-y-0 md:translate-x-4",
          "transition-[transform,opacity] duration-200 motion-reduce:transition-none",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-border shrink-0">
          <div>
            <h2
              id="chatbot-panel-title"
              className="text-sm font-semibold text-text-primary"
            >
              Ask the assistant
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Streams answers from Gemini · responses can be inaccurate
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ml-2 shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Message list ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          <ChatMessageList
            messages={messages}
            isStreaming={status === "streaming" || status === "submitted"}
          >
            {messages.length === 0 && (
              <SuggestedQuestions
                onSelect={onSendMessage}
                disabled={isActive}
              />
            )}
          </ChatMessageList>
        </div>

        {/* ── Error banner ─────────────────────────────────────────────── */}
        {error && (
          <div className="px-4 py-2 border-t border-border shrink-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-red-400">
                {error.type === "rate_limited"
                  ? `Too many questions — please wait ${error.retryAfterSeconds}s, or`
                  : "Something went wrong — retry, or"}
                {" "}
                <a
                  href="mailto:oscarmdzgarcia@gmail.com"
                  className="underline hover:text-red-300 transition-colors"
                >
                  email Oscar
                </a>
                .
              </p>
              {error.type === "error" && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-xs text-text-secondary hover:text-text-primary transition-colors shrink-0 underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Input row ────────────────────────────────────────────────── */}
        <ChatInput
          textareaRef={textareaRef}
          onSend={onSendMessage}
          onStop={onStop}
          isStreaming={isActive}
        />
      </div>
    </>
  );
}
