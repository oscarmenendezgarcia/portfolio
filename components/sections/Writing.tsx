// Server Component — Writing section.
// Lists articles and posts published on external platforms (LinkedIn, X, Blog),
// ordered by date descending. Layout: simple list, no thumbnails.

type Platform = "LinkedIn" | "X" | "Blog";

type Article = {
  title: string;
  /** ISO 8601 date — used for sorting and the <time> datetime attribute. */
  date: string;
  dateDisplay: string;
  platform: Platform;
  href: string;
};

// Articles ordered newest-first. Add new entries at the top.
const ARTICLES: Article[] = [
  {
    title: "Building a Minimalist Design System with Tailwind v4",
    date: "2026-03-15",
    dateDisplay: "Mar 2026",
    platform: "Blog",
    href: "https://oscar.dev/posts/tailwind-v4-design-system",
  },
  {
    title: "TypeScript satisfies vs as: When to Use Each",
    date: "2026-02-28",
    dateDisplay: "Feb 2026",
    platform: "LinkedIn",
    href: "https://linkedin.com/in/oscarmenendezgarcia/",
  },
  {
    title: "Why I Stopped Using JavaScript Scroll Libraries",
    date: "2026-01-20",
    dateDisplay: "Jan 2026",
    platform: "X",
    href: "https://x.com/oscarmenendez",
  },
  {
    title: "The Case for Fewer Abstractions in Frontend Code",
    date: "2025-11-05",
    dateDisplay: "Nov 2025",
    platform: "Blog",
    href: "https://oscar.dev/posts/fewer-abstractions",
  },
  {
    title: "Ship Boring Infrastructure, Build Exciting Products",
    date: "2025-09-18",
    dateDisplay: "Sep 2025",
    platform: "LinkedIn",
    href: "https://linkedin.com/in/oscarmenendezgarcia/",
  },
];

/** Sorted newest-first as a defensive measure (source of truth is the array above). */
const sortedArticles = [...ARTICLES].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const PLATFORM_LABEL: Record<Platform, string> = {
  LinkedIn: "LinkedIn",
  X: "X (Twitter)",
  Blog: "Blog",
};

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

        <ol className="flex flex-col divide-y divide-border" role="list">
          {sortedArticles.map((article) => (
            <li key={`${article.date}-${article.title}`} className="py-5 first:pt-0 last:pb-0">
              <div className="flex items-baseline gap-3 mb-1">
                <time
                  dateTime={article.date}
                  className="text-xs font-mono text-text-secondary tabular-nums shrink-0"
                >
                  {article.dateDisplay}
                </time>
                <span className="text-xs text-border" aria-hidden="true">·</span>
                <span className="text-xs font-mono text-text-secondary">
                  {PLATFORM_LABEL[article.platform]}
                </span>
              </div>

              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1 text-base font-medium text-text-primary hover:text-accent transition-colors"
              >
                <span>{article.title}</span>
                <span
                  className="text-text-secondary group-hover:text-accent transition-colors text-sm"
                  aria-hidden="true"
                >
                  &nbsp;&rarr;
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
