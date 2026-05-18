// Server Component — Work section: hybrid grid of personal projects and professional roles.
// Data lives in lib/site.ts; kicker numbering is auto-generated from combined array index.

import {
  projects as siteProjects,
  experience as siteExperience,
  type ProjectCard,
  type Role,
} from "@/lib/site";

// ─── CardView ─────────────────────────────────────────────────────────────────
// Normalised render contract shared by both project and role cards.

type CardView = {
  id: string;
  /** Two-digit numeric label, e.g. "01". */
  kicker: string;
  title: string;
  /** Accent-coloured subtitle: job title or project owner role. */
  subtitle: string;
  /** Date range or "Personal project" — rendered in monospace. */
  meta: string;
  /** Lead sentence: first responsibility or project description. */
  body: string;
  /** Remaining responsibilities rendered as a <ul> (role cards only). */
  bullets?: string[];
  stack: string[];
  statusLabel: string;
  statusKind: "current" | "past" | "project";
  /** Defined for project cards; absent for role cards. */
  href?: string;
};

// ─── Adapters ─────────────────────────────────────────────────────────────────

function fromProject(p: ProjectCard): Omit<CardView, "kicker"> {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.role,
    meta: "Personal project",
    body: p.description,
    bullets: undefined,
    stack: p.stack,
    statusLabel: "Personal",
    statusKind: "project",
    href: p.href,
  };
}

function fromRole(r: Role): Omit<CardView, "kicker"> {
  const [first, ...rest] = r.responsibilities;
  return {
    id: r.id,
    title: r.company,
    subtitle: r.title,
    meta: r.dateRange,
    body: first ?? "",
    bullets: rest.length > 0 ? rest : undefined,
    stack: r.stack,
    statusLabel: r.status === "current" ? "Current" : "Past",
    statusKind: r.status,
    href: undefined,
  };
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusClasses(kind: CardView["statusKind"]): string {
  switch (kind) {
    case "current":
      return "bg-[#1a4d2e] text-[#4ade80]";
    case "past":
      return "bg-[#333333] text-text-primary";
    case "project":
      return "bg-[#3a2f1a] text-accent";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface WorkProps {
  /** Override project list (useful for testing / story variants). */
  projects?: ProjectCard[];
  /** Override experience list (useful for testing / story variants). */
  experience?: Role[];
  /** Cap how many cards appear in the grid. Default: 6. */
  maxItems?: number;
}

export default function Work({
  projects = siteProjects,
  experience = siteExperience,
  maxItems = 6,
}: WorkProps) {
  const items: CardView[] = [
    ...projects.map(fromProject),
    ...experience.map(fromRole),
  ]
    .slice(0, maxItems)
    .map((card, i) => ({ ...card, kicker: String(i + 1).padStart(2, "0") }));

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-20 border-t border-border"
    >
      <div className="max-w-[900px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Section heading */}
        <h2
          id="work-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-2"
        >
          Work
        </h2>

        {/* Sub-heading */}
        <p className="text-text-secondary text-sm mb-8">
          Recent projects and roles
        </p>

        {/* Responsive grid: 1 col mobile → 2 cols ≥768px */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map((card) => (
            <article
              key={card.id}
              className="flex flex-col bg-surface border border-border rounded-[var(--radius-md)] p-4 md:p-5 hover:bg-surface-elevated transition-colors duration-150 ease-out"
            >
              {/* ── Kicker ──────────────────────────────────────────── */}
              <span
                aria-hidden="true"
                className="text-xs font-mono font-bold text-accent mb-3 leading-none"
              >
                {card.kicker}/
              </span>

              {/* ── Title ───────────────────────────────────────────── */}
              <h3 className="text-lg font-semibold text-text-primary mb-1 leading-snug">
                {card.title}
              </h3>

              {/* ── Subtitle (accent) ─────────────────────────────────── */}
              <p className="text-[13px] text-accent mb-1">{card.subtitle}</p>

              {/* ── Meta: dateRange or "Personal project" ─────────────── */}
              <p className="font-mono text-[11px] text-text-secondary mb-3 tracking-wide">
                {card.meta}
              </p>

              {/* ── Body ────────────────────────────────────────────── */}
              <p className="text-sm text-text-secondary leading-relaxed mb-2 flex-1">
                {card.body}
              </p>

              {/* ── Bullet responsibilities (role cards only) ────────── */}
              {card.bullets && card.bullets.length > 0 && (
                <ul className="text-xs text-text-secondary list-disc ml-4 mb-3 space-y-0.5">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}

              {/* ── Tech stack badges ───────────────────────────────── */}
              <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5 mb-4">
                {card.stack.map((tech) => (
                  <li
                    key={tech}
                    className="text-[12px] text-text-secondary border border-border rounded-full px-2 py-0.5 leading-tight"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              {/* ── Footer: status pill + optional view link ─────────── */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <span
                  className={`text-[11px] font-medium rounded-full px-2 py-0.5 leading-tight ${statusClasses(card.statusKind)}`}
                >
                  {card.statusLabel}
                </span>

                {card.href && (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${card.title} (opens in new tab)`}
                    className="text-[13px] text-accent hover:text-accent-hover transition-colors duration-150 ease-out"
                  >
                    View &rarr;
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
