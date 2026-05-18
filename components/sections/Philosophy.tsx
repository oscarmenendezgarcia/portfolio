// Server Component — placeholder stub. Content populated in the Philosophy feature task.

const PRINCIPLES = [
  {
    number: "1.",
    title: "Clarity over cleverness.",
    body: "Systems should be obvious to understand. The best code is the code that a newcomer can read without a guide.",
  },
  {
    number: "2.",
    title: "User-centered from day one.",
    body: "Technology serves people, not the reverse. Every architectural decision is a UX decision in disguise.",
  },
  {
    number: "3.",
    title: "Minimize until essential.",
    body: "Simplicity is earned, not given. Remove everything that doesn't carry its weight — then remove it again.",
  },
] as const;

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="py-20 border-t border-border"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <h2
          id="philosophy-heading"
          className="text-2xl lg:text-4xl font-semibold text-text-primary mb-10"
        >
          Philosophy
        </h2>

        <p className="text-base text-text-secondary leading-relaxed mb-10 max-w-xl">
          The work I do is shaped by a few core beliefs — about software, about
          teams, and about what it means to build something worth using.
        </p>

        <div className="flex flex-col gap-8">
          {PRINCIPLES.map((principle) => (
            <div key={principle.number} className="flex gap-6">
              <span
                className="text-text-secondary font-mono text-sm mt-1 shrink-0 w-5"
                aria-hidden="true"
              >
                {principle.number}
              </span>
              <div>
                <p className="text-base font-semibold text-text-primary mb-1">
                  {principle.title}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {principle.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
