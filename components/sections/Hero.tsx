// Server Component — no client-side JS required.
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="py-12 lg:py-16"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        {/* Role + location — monospace label, single line */}
        <p className="font-mono text-xs font-semibold text-text-secondary tracking-widest uppercase mb-3">
          {site.role} · {site.location}
        </p>

        {/* Display name */}
        <h1
          id="hero-heading"
          className="text-4xl lg:text-6xl font-medium text-text-primary leading-[1.05] tracking-[-0.02em] mb-5"
        >
          {site.name}
        </h1>

        {/* Tagline */}
        <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-xl mb-4">
          {site.description}
        </p>

        {/* CTA to assistant */}
        <p className="text-base text-text-secondary leading-relaxed max-w-xl">
          Ask the assistant anything about my experience, projects, or how I work.
        </p>
      </div>
    </section>
  );
}
