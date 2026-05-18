// Server Component — Writing section.
// Displays a chronological list of published articles from external platforms.

import { ARTICLES } from "@/lib/content/writing";

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
          {ARTICLES.map((article) => (
            <article
              key={article.date + article.title}
              className="border-b border-border pb-8 last:border-0 last:pb-0 hover:bg-surface-elevated -mx-4 px-4 rounded-[var(--radius-md)] transition-colors"
            >
              {/* Metadata row: date · platform */}
              <div className="flex items-center gap-3 mb-2">
                <time
                  dateTime={article.date}
                  className="text-xs text-text-secondary"
                >
                  {article.dateDisplay}
                </time>
                <span aria-hidden="true" className="text-xs text-border">
                  ·
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  {article.platform}
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
                target="_blank"
                rel="noopener noreferrer"
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
