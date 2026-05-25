"use client";

import type { UIMessage } from "ai";
import type { ReactNode } from "react";

interface ChatMessageProps {
  message: UIMessage;
  isLastAssistant: boolean;
  isStreaming: boolean;
}

const LINK_CLASSES =
  "text-accent underline underline-offset-2 hover:text-accent-hover break-all";

// Groups: 1-3 [label](href)  4 bare URL  5 email
const URL_RE =
  /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s<>"]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

// Groups: 1-3 [label](href)  4 bare URL  5-6 **bold**  7-8 *italic*  9 email
const INLINE_RE =
  /(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|(https?:\/\/[^\s<>"]+)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function renderLink(key: string, href: string, label: ReactNode): ReactNode {
  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASSES}>
      {label}
    </a>
  );
}

// Only detects links and emails — used inside bold/italic to avoid recursion
function parseLinksOnly(text: string, keyOffset: number): ReactNode[] {
  const re = new RegExp(URL_RE.source, "g");
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `${keyOffset}-${match.index}`;
    if (match[1])      nodes.push(renderLink(key, match[3], match[2]));
    else if (match[4]) nodes.push(renderLink(key, match[4], match[4]));
    else if (match[5]) nodes.push(renderLink(key, `mailto:${match[5]}`, match[5]));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function parseInline(text: string, keyOffset: number): ReactNode[] {
  const re = new RegExp(INLINE_RE.source, "g");
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const key = `${keyOffset}-${match.index}`;
    if (match[1])      nodes.push(renderLink(key, match[3], match[2]));
    else if (match[4]) nodes.push(renderLink(key, match[4], match[4]));
    else if (match[5]) nodes.push(<strong key={key}>{parseLinksOnly(match[6], keyOffset * 100)}</strong>);
    else if (match[7]) nodes.push(<em key={key}>{parseLinksOnly(match[8], keyOffset * 100)}</em>);
    else if (match[9]) nodes.push(renderLink(key, `mailto:${match[9]}`, match[9]));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function parseMarkdown(text: string, caret: ReactNode): ReactNode[] {
  const blocks = text.split(/\n\n/);
  const result: ReactNode[] = [];

  blocks.forEach((block, i) => {
    const isLast = i === blocks.length - 1;
    const lines = block.split("\n");
    const listItems = lines.filter((l) => /^[-*] /.test(l));

    if (listItems.length > 0 && listItems.length === lines.filter((l) => l.trim()).length) {
      result.push(
        <ul key={i} className="list-disc list-outside ml-4 space-y-0.5 mb-2 last:mb-0">
          {listItems.map((line, j) => {
            const isLastItem = isLast && j === listItems.length - 1;
            return (
              <li key={j}>
                {parseInline(line.slice(2), i * 1000 + j)}
                {isLastItem ? caret : null}
              </li>
            );
          })}
        </ul>
      );
    } else {
      result.push(
        <p key={i} className="mb-2 last:mb-0">
          {parseInline(block, i)}
          {isLast ? caret : null}
        </p>
      );
    }
  });

  return result;
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
