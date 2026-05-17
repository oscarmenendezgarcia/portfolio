"use client";

import { useRef, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatErrorState } from "@/lib/chatbot/types";
import ChatbotLauncher from "./ChatbotLauncher";
import ChatbotPanel from "./ChatbotPanel";

/**
 * Root chatbot component — owns open/closed state and useChat wiring.
 * Lazy-loaded via next/dynamic (ssr: false) from app/page.tsx so the
 * homepage static bundle is unaffected until the user opens the panel.
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorState, setErrorState] = useState<ChatErrorState>(null);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      // The DefaultChatTransport throws with the raw response body as the
      // error message (see http-chat-transport.ts). Parse it to detect 429.
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
        // Not JSON — fall through to generic error
      }
      setErrorState({ type: "error" });
    },
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setErrorState(null);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Return focus to the launcher button
    setTimeout(() => launcherRef.current?.focus(), 50);
  }, []);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen, handleClose]);

  const handleSendMessage = useCallback(
    (text: string) => {
      setErrorState(null);
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleRetry = useCallback(() => {
    setErrorState(null);
    regenerate();
  }, [regenerate]);

  // Map SDK error (truthy) to our error state if not already set by onError
  const displayError: ChatErrorState =
    errorState ?? (error ? { type: "error" } : null);

  return (
    <>
      <ChatbotLauncher
        isOpen={isOpen}
        onToggle={handleToggle}
        launcherRef={launcherRef}
      />
      <ChatbotPanel
        isOpen={isOpen}
        onClose={handleClose}
        messages={messages}
        status={status}
        error={displayError}
        onSendMessage={handleSendMessage}
        onStop={stop}
        onRetry={handleRetry}
        textareaRef={textareaRef}
      />
    </>
  );
}
