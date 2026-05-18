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
        <h1
          id="hero-heading"
          className="text-4xl lg:text-6xl font-bold text-text-primary leading-tight tracking-tight mb-6"
        >
          {site.name}
        </h1>

        <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-xl mb-10">
          {site.role}.
          <br />
          Fascinated by systems, clarity, and delightful user experiences.
        </p>

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
