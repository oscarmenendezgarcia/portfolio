// Server Component — placeholder stub. Content populated in the Writing feature task.

type Article = {
  title: string;
  date: string; // ISO 8601
  dateDisplay: string;
  category: string;
  excerpt: string;
  href: string;
};

const PLACEHOLDER_ARTICLES: Article[] = [
  {
    title: "Building a Minimalist Design System with Tailwind v4",
    date: "2026-03-15",
    dateDisplay: "Mar 15, 2026",
    category: "Design Systems",
    excerpt:
      "How I replaced a complex tailwind.config.js with a handful of CSS custom properties and never looked back.",
    href: "#",
  },
  {
    title: "TypeScript Satisfies vs As: When to Use Each",
    date: "2026-03-01",
    dateDisplay: "Mar 1, 2026",
    category: "TypeScript",
    excerpt:
      "The satisfies operator quietly became my most-used TypeScript feature. Here's why.",
    href: "#",
  },
  {
    title: "Why I Stopped Using JavaScript Scroll Libraries",
    date: "2026-02-10",
    dateDisplay: "Feb 10, 2026",
    category: "Performance",
    excerpt:
      "Native scroll-behavior: smooth does 95% of what Lenis does, ships zero bytes, and respects prefers-reduced-motion for free.",
    href: "#",
  },
];

export default function Writing() {
  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="py-20 border-t border-border"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <h2
          id="writing-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-10"
        >
          Writing
        </h2>

        <div className="flex flex-col gap-8">
          {PLACEHOLDER_ARTICLES.map((article) => (
            <article
              key={article.title}
              className="border-b border-border pb-8 last:border-0 hover:bg-surface-elevated -mx-4 px-4 rounded-[var(--radius-md)] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <time
                  dateTime={article.date}
                  className="text-xs text-text-secondary"
                >
                  {article.dateDisplay}
                </time>
                <span className="text-xs text-border" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  {article.category}
                </span>
              </div>

              <h3 className="text-base font-semibold text-text-primary mb-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                {article.excerpt}
              </p>

              <a
                href={article.href}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Read more &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
