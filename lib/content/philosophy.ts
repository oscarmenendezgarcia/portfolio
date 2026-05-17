// Content module — Philosophy section principles.
// Single source of truth for both the Philosophy section and the chatbot persona.

export type Principle = {
  number: string;
  title: string;
  body: string;
};

export const PRINCIPLES: readonly Principle[] = [
  {
    number: "1.",
    title: "Clarity over cleverness.",
    body: "Systems should be obvious to understand. The best code is the code that a newcomer can read without a guide.",
  },
  {
    number: "2.",
    title: "User-centered from day one.",
    body: "Technology serves people, not the reverse. Every architectural decision is a UX decision in disguise.",
  },
  {
    number: "3.",
    title: "Minimize until essential.",
    body: "Simplicity is earned, not given. Remove everything that doesn't carry its weight — then remove it again.",
  },
] as const;
