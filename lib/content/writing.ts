// Content module — Writing section articles.
// Single source of truth for both the Writing section and the chatbot persona.

export type Article = {
  title: string;
  /** ISO 8601 date (YYYY-MM-DD) */
  date: string;
  /** Pre-formatted display string ("Mon DD, YYYY") */
  dateDisplay: string;
  platform: "LinkedIn" | "X" | "Blog";
  excerpt: string;
  href: string;
};

/** Articles sorted newest-first. */
export const ARTICLES: Article[] = [
  {
    title: "Building a Minimalist Design System with Tailwind v4",
    date: "2026-03-15",
    dateDisplay: "Mar 15, 2026",
    platform: "Blog",
    excerpt:
      "How I replaced a complex tailwind.config.js with a handful of CSS custom properties and never looked back.",
    href: "#",
  },
  {
    title: "TypeScript Satisfies vs As: When to Use Each",
    date: "2026-03-01",
    dateDisplay: "Mar 1, 2026",
    platform: "LinkedIn",
    excerpt:
      "The satisfies operator quietly became my most-used TypeScript feature. Here's why.",
    href: "#",
  },
  {
    title: "Why I Stopped Using JavaScript Scroll Libraries",
    date: "2026-02-10",
    dateDisplay: "Feb 10, 2026",
    platform: "X",
    excerpt:
      "Native scroll-behavior: smooth does 95% of what Lenis does, ships zero bytes, and respects prefers-reduced-motion for free.",
    href: "#",
  },
];
