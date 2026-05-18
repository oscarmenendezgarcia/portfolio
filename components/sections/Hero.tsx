// Server Component — no client-side JS required.
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="py-20 lg:py-32"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        {/* Display name — largest, most prominent element on the page */}
        <h1
          id="hero-heading"
          className="text-4xl lg:text-6xl font-semibold text-text-primary leading-[1.1] tracking-[-0.04em] mb-3"
        >
          {site.name}
        </h1>

        {/* Location — monospace label, subordinate to name, grouped with identity */}
        <p
          aria-label={`Based in ${site.location}`}
          className="font-mono text-xs font-semibold text-text-secondary tracking-widest uppercase mb-6"
        >
          {site.location}
        </p>

        {/* Professional role — secondary hierarchy */}
        <p className="text-lg lg:text-xl text-text-secondary leading-relaxed mb-2">
          {site.role}
        </p>

        {/* Tagline — monospace, between role and bio */}
        <p className="font-mono text-xs uppercase tracking-widest text-text-secondary mb-6">
          {site.tagline}
        </p>

        {/* Bio — 2-sentence narrative drawn from CV */}
        <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-xl mb-10">
          {site.bio}
        </p>

        {/* Primary CTA — accent gold, underline, keyboard accessible */}
        <a
          href={site.cvPath}
          download
          className="inline-block text-accent hover:text-accent-hover underline underline-offset-4 transition-colors text-base font-medium"
        >
          Download CV
        </a>
      </div>
    </section>
  );
}
