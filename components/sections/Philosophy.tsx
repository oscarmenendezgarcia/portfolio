import { PRINCIPLES } from "@/lib/content/philosophy";

export default function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-heading" className="py-12">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <h2
          id="philosophy-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary tracking-tight mb-8"
        >
          Philosophy
        </h2>

        <ol className="flex flex-col divide-y divide-border/20" role="list">
          {PRINCIPLES.map((principle) => (
            <li key={principle.number} className="flex gap-5 py-4 first:pt-0 last:pb-0">
              <span className="text-[11px] font-mono text-accent/50 mt-[3px] shrink-0 w-4 tabular-nums" aria-hidden="true">
                {String(principle.number).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold text-text-primary mb-0.5 leading-snug">
                  {principle.title}
                </p>
                <p className="text-sm text-text-secondary/80 leading-relaxed">
                  {principle.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
