// Server Component — no client-side JS required.

type Principle = {
  slug: string;
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    slug: "ship-learn-iterate",
    title: "Ship, learn, iterate.",
    body: "Perfection shipped never beats good shipped now. I'd rather put something real in users' hands on Monday and learn what matters than spend two weeks polishing assumptions.",
  },
  {
    slug: "ownership-at-every-level",
    title: "Ownership at every level.",
    body: "The best engineers don't wait to be told what's broken. They notice it, name it, fix it — and make sure it stays fixed. Ownership is a posture, not a title.",
  },
  {
    slug: "clarity-over-cleverness",
    title: "Clarity over cleverness.",
    body: "Systems should be obvious to understand. The most impressive line of code is the one a newcomer can read without a guide — because it was written for humans first.",
  },
  {
    slug: "user-centered-from-day-one",
    title: "User-centered from day one.",
    body: "Technology serves people, not the reverse. Every architectural decision is a UX decision in disguise. I try to make sure the people building the product never forget the people using it.",
  },
  {
    slug: "minimize-until-essential",
    title: "Minimize until essential.",
    body: "Simplicity is earned, not given. Remove everything that doesn't carry its weight — then question what's left. The hardest part of building good software is deciding what not to build.",
  },
  {
    slug: "teams-compound",
    title: "Teams compound.",
    body: "The highest-leverage thing I can do most weeks isn't writing code — it's leaving the codebase, the docs, and the culture slightly better for the next person. Great teams are built in the margins.",
  },
];

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

        <p className="text-base text-text-secondary leading-relaxed mb-12 max-w-xl">
          The work I do is shaped by a few core beliefs — about software, about
          teams, and about what it means to build something worth using.
        </p>

        <ol className="flex flex-col gap-0" aria-label="Core principles">
          {PRINCIPLES.map((principle, index) => (
            <li
              key={principle.slug}
              className="flex gap-6 py-8 border-b border-border last:border-0 group"
            >
              {/* Ordinal — monospaced, accent on hover */}
              <span
                className="font-mono text-sm text-border group-hover:text-accent shrink-0 w-6 pt-[3px] transition-colors duration-200 select-none"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-text-primary leading-snug">
                  {principle.title}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed max-w-prose">
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
