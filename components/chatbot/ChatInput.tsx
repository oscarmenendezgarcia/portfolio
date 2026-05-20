"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { MAX_INPUT_CHARS } from "@/lib/chatbot/config";

interface ChatInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

const CHAR_COUNTER_THRESHOLD = 800;
const CHAR_WARNING_THRESHOLD = 950;

/**
 * Input row: auto-grow textarea (1–4 rows) + send/stop button + char counter.
 * Enter submits; Shift+Enter inserts a newline.
 */
export default function ChatInput({
  textareaRef,
  onSend,
  onStop,
  isStreaming,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const charCount = value.length;
  const overLimit = charCount > MAX_INPUT_CHARS;
  const isEmpty = value.trim().length === 0;
  const canSend = !isEmpty && !overLimit;

  const submit = useCallback(() => {
    if (!canSend || isStreaming) return;
    onSend(value.trim());
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [canSend, isStreaming, onSend, value, textareaRef]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setValue(target.value);
    // Auto-grow: clamp between 1 and 4 rows
    target.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(target).lineHeight, 10) || 20;
    const maxHeight = lineHeight * 4 + 16; // 4 rows + padding
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
  };

  const showCounter = charCount >= CHAR_COUNTER_THRESHOLD;
  const counterIsWarning = charCount >= CHAR_WARNING_THRESHOLD;

  return (
    <div className="px-3 py-3 border-t border-border shrink-0">
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          rows={1}
          aria-label="Message input"
          aria-multiline="true"
          className={[
            "flex-1 resize-none rounded-md px-3 py-2",
            "bg-bg border text-sm text-text-primary placeholder:text-text-secondary",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            overLimit ? "border-red-500" : "border-border focus:border-accent",
            "transition-colors leading-relaxed",
            "min-h-[40px] max-h-[104px]",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Send / Stop button */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="shrink-0 w-10 h-10 rounded-md bg-surface-elevated border border-border text-text-secondary hover:text-text-primary hover:border-accent transition-colors flex items-center justify-center"
          >
            {/* Stop icon (filled square) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            className={[
              "shrink-0 w-10 h-10 rounded-md border transition-colors flex items-center justify-center",
              canSend
                ? "bg-surface-elevated border-border text-text-secondary hover:border-accent hover:text-accent"
                : "bg-surface-elevated border-border text-border cursor-not-allowed",
            ].join(" ")}
          >
            {/* Arrow-up send icon */}
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
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Character counter — visible only at ≥ 800 chars */}
      {showCounter && (
        <p
          className={[
            "text-xs mt-1 text-right",
            counterIsWarning
              ? overLimit
                ? "text-red-500"
                : "text-yellow-500"
              : "text-text-secondary",
          ].join(" ")}
          aria-live="polite"
        >
          {charCount}/{MAX_INPUT_CHARS}
        </p>
      )}
    </div>
  );
}
