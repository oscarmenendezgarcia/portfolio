"use client";

const SUGGESTIONS = [
  "What are you working on?",
  "Are you available for new projects?",
  "What's your tech stack?",
  "How do I contact Oscar?",
] as const;

interface SuggestedQuestionsProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

export default function SuggestedQuestions({
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div
      className="px-5 py-4 flex flex-wrap gap-2"
      aria-label="Suggested questions"
    >
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className={[
            "text-xs text-text-secondary px-3 py-1.5 rounded-full",
            "border border-border bg-transparent",
            "hover:border-accent/60 hover:text-text-primary hover:bg-surface-elevated",
            "active:scale-[0.97]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "transition-all duration-150",
          ].join(" ")}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
