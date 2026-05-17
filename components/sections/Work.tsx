// Server Component — Work section: responsive grid of highlighted projects.
// Data lives in lib/site.ts; numbering is auto-generated from array index.

import { projects as siteProjects, type ProjectCard } from "@/lib/site";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ProjectCard["status"], string> = {
  "in-progress": "In Development",
  launched: "Launched",
  archived: "Archived",
};

/**
 * Returns Tailwind classes for the status badge pill.
 * Colors are arbitrary values because these states don't have named tokens.
 */
function statusClasses(status: ProjectCard["status"]): string {
  switch (status) {
    case "in-progress":
      return "bg-[#1a4d2e] text-[#4ade80]";
    case "launched":
      return "bg-[#333333] text-text-primary";
    case "archived":
      return "bg-[#4d4d4d] text-text-secondary";
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface WorkProps {
  /** Override the default project list (useful for testing / story variants). */
  projects?: ProjectCard[];
  /** Cap how many projects appear in the grid. Default: 4. */
  maxProjects?: number;
}

export default function Work({
  projects = siteProjects,
  maxProjects = 4,
}: WorkProps) {
  const displayed = projects.slice(0, maxProjects);

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
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-10"
        >
          Work
        </h2>

        {/* Responsive grid: 1 col mobile → 2 cols ≥768px */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {displayed.map((project, index) => {
            // Auto-generate "01/", "02/", … from array position
            const number = String(index + 1).padStart(2, "0");
            const isExternal = project.href.startsWith("http");

            return (
              <article
                key={project.id}
                className="flex flex-col bg-surface border border-border rounded-[var(--radius-md)] p-4 md:p-5 hover:bg-surface-elevated transition-colors duration-150 ease-out"
              >
                {/* ── Project number badge ────────────────────────────── */}
                <span
                  aria-hidden="true"
                  className="text-xs font-mono font-bold text-accent mb-3 leading-none"
                >
                  {number}/
                </span>

                {/* ── Title ───────────────────────────────────────────── */}
                <h3 className="text-lg font-semibold text-text-primary mb-2 leading-snug">
                  {project.title}
                </h3>

                {/* ── Description ─────────────────────────────────────── */}
                <p className="text-sm text-text-secondary leading-relaxed mb-3 flex-1">
                  {project.description}
                </p>

                {/* ── Role ────────────────────────────────────────────── */}
                <p className="text-[13px] text-accent mb-3">{project.role}</p>

                {/* ── Tech stack badges ───────────────────────────────── */}
                <ul
                  aria-label="Tech stack"
                  className="flex flex-wrap gap-1.5 mb-4"
                >
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="text-[12px] text-text-secondary border border-border rounded-full px-2 py-0.5 leading-tight"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {/* ── Footer: status badge + view link ────────────────── */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                  {/* Status pill */}
                  <span
                    className={`text-[11px] font-medium rounded-full px-2 py-0.5 leading-tight ${statusClasses(project.status)}`}
                  >
                    {STATUS_LABEL[project.status]}
                  </span>

                  {/* View link */}
                  <a
                    href={project.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={`View ${project.title}${isExternal ? " (opens in new tab)" : ""}`}
                    className="text-[13px] text-accent hover:text-accent-hover transition-colors duration-150 ease-out"
                  >
                    View &rarr;
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
