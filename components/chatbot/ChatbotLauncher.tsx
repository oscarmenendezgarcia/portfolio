"use client";

import { useEffect, useState } from "react";

interface ChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Floating launcher button — fixed bottom-right, always visible.
 * Pulses once per session on first page visit (unless prefers-reduced-motion).
 */
export default function ChatbotLauncher({
  isOpen,
  onToggle,
  launcherRef,
}: ChatbotLauncherProps) {
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const key = "chatbot-pulse-shown";
    if (!sessionStorage.getItem(key)) {
      setShouldPulse(true);
      sessionStorage.setItem(key, "1");
      // Remove the pulse after one animation cycle (~2 s)
      const t = setTimeout(() => setShouldPulse(false), 2_000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <button
      ref={launcherRef}
      type="button"
      onClick={onToggle}
      aria-label="Open assistant"
      aria-expanded={isOpen}
      aria-controls="chatbot-panel"
      className={[
        // Size & shape
        "fixed bottom-6 right-6 z-50",
        "w-14 h-14 rounded-full",
        // Colours & border
        "bg-surface-elevated border border-border",
        "text-text-secondary",
        // Hover state
        "hover:bg-accent hover:text-bg hover:scale-105",
        // Transition
        "transition-all duration-150",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        // Pulse (one-shot)
        shouldPulse ? "animate-ping-once" : "",
        // Mobile: tighter offset
        "max-sm:bottom-4 max-sm:right-4",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Inline SVG chat bubble — avoids icon-font bundle impact */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-6 h-6 mx-auto"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
