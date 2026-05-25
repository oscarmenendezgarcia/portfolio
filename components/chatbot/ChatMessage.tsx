"use client";

import type { UIMessage } from "ai";
import type { ReactNode } from "react";

interface ChatMessageProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isStreaming: boolean;
}

/**
 * Parses inline markdown within a single paragraph of text.
 * Supported: **bold**, *italic*, [text](url), bare https:// URLs.
 * During streaming, incomplete patterns (e.g. ** with no closing **) are
 * left as plain text because the regex simply won't match them.
 */
function parseInline(text: string, keyOffset: number): ReactNode[] {
  // Group layout:
  //  1: full [text](url)   2: link label   3: link href
  //  4: bare URL
  //  5: full **bold**      6: bold text
  //  7: full *italic*      8: italic text
  const re =
    /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s<>"]+)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const key = `${keyOffset}-${match.index}`;

    if (match[1]) {
      // [label](href)
      nodes.push(
        <a
          key={key}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-hover break-all"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // bare URL
      nodes.push(
        <a
          key={key}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-hover break-all"
        >
          {match[4]}
        </a>
      );
    } else if (match[5]) {
      // **bold**
      nodes.push(<strong key={key}>{match[6]}</strong>);
    } else if (match[7]) {
      // *italic*
      nodes.push(<em key={key}>{match[8]}</em>);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/**
 * Splits text on double-newlines into paragraphs, runs inline parsing on
 * each, and appends the streaming caret to the last paragraph.
 */
function parseMarkdown(text: string, caret: ReactNode): ReactNode[] {
  const paragraphs = text.split(/\n\n/);

  return paragraphs.map((para, i) => {
    const isLast = i === paragraphs.length - 1;
    return (
      <p key={i} className="mb-2 last:mb-0">
        {parseInline(para, i)}
        {isLast ? caret : null}
      </p>
    );
  });
}

/**
 * Single chat bubble.
 * User messages: right-aligned, surface-elevated background.
 * Assistant messages: left-aligned, no background, prose text with markdown rendering.
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

  const caret = showCaret ? (
    <span
      aria-hidden="true"
      className="inline-block w-px h-[1em] bg-accent ml-0.5 align-middle animate-blink motion-reduce:animate-none"
    />
  ) : null;

  return (
    <div
      className={[
        "flex",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "rounded-md px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-[#2C2925] text-[#F7F5F0] max-w-[80%]"
            : "bg-surface-elevated text-text-primary max-w-[92%]",
        ].join(" ")}
      >
        {isUser ? (
          <>
            {text}
            {caret}
          </>
        ) : (
          parseMarkdown(text, caret)
        )}
      </div>
    </div>
  );
}
