import { ARTICLES } from "@/lib/content/writing";

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
    <section id="writing" aria-labelledby="writing-heading" className="py-12">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <h2
          id="writing-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary tracking-tight mb-8"
        >
          Writing
        </h2>

        <ol className="flex flex-col divide-y divide-border/20" role="list">
          {ARTICLES.map((article) => (
            <li key={article.date + article.title} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-baseline gap-2 mb-1.5">
                <time dateTime={article.date} className="text-[11px] font-mono text-text-secondary/50 tabular-nums shrink-0">
                  {article.dateDisplay}
                </time>
                <span aria-hidden="true" className="text-border/40 text-[11px]">·</span>
                <span className="text-[11px] font-mono text-text-secondary/50 uppercase tracking-wide">
                  {article.platform}
                </span>
              </div>

              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1"
              >
                <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-150 leading-snug">
                  {article.title}
                </span>
                <span className="text-text-secondary/40 group-hover:text-accent/60 transition-colors text-xs" aria-hidden="true">
                  &nbsp;&rarr;
                </span>
              </a>

              {article.excerpt && (
                <p className="text-sm text-text-secondary/70 leading-relaxed mt-1 max-w-2xl">
                  {article.excerpt}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
