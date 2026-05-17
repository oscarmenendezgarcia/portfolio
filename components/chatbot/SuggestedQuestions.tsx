"use client";

const SUGGESTIONS = [
  "What are you working on?",
  "Are you available for new projects?",
  "How do I contact Oscar?",
] as const;

interface SuggestedQuestionsProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

/**
 * Initial chip row shown when the conversation is empty.
 * Clicking a chip submits that text as the user's first message.
 */
export default function SuggestedQuestions({
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div
      className="px-4 py-3 flex flex-col gap-2"
      aria-label="Suggested questions"
    >
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className={[
            "text-left text-xs text-text-secondary px-3 py-2 rounded-md",
            "border border-border",
            "hover:border-accent hover:text-text-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors",
          ].join(" ")}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
